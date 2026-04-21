import Stripe from "stripe";
import { env } from "../config/env.js";
import { prisma } from "../db/index.js";
import { HttpError } from "../utils/httpError.js";
import type { CreateCheckoutSessionDto } from "../dto/billing/create-checkout-session.dto.js";

function getStripe(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new HttpError(500, "Stripe is not configured");
  }
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
}

function priceIdForPlan(plan: CreateCheckoutSessionDto["plan"]): string {
  const priceId = plan === "pro" ? env.STRIPE_PRICE_PRO : env.STRIPE_PRICE_ENTERPRISE;
  if (!priceId) throw new HttpError(500, "Stripe prices are not configured");
  return priceId;
}

function isActiveSubscriptionStatus(status: Stripe.Subscription.Status | null | undefined): boolean {
  return status === "active" || status === "trialing";
}

export const billingService = {
  async createCheckoutSession(args: { userId: string; input: CreateCheckoutSessionDto }) {
    const { userId, input } = args;
    const stripe = getStripe();

    const role = await prisma.userRole.findUnique({ where: { userId }, select: { role: true } });
    if (!role || role.role !== "contractor") {
      throw new HttpError(403, "Only contractors can start a subscription");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, stripeCustomerId: true },
    });
    if (!user) throw new HttpError(404, "User not found");

    const priceId = priceIdForPlan(input.plan);

    const customerId =
      user.stripeCustomerId ??
      (await (async () => {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.fullName,
          metadata: { userId: user.id },
        });
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id },
        });
        return customer.id;
      })());

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONTEND_URL}/checkout?plan=${encodeURIComponent(input.plan)}&canceled=1`,
      client_reference_id: user.id,
      metadata: { userId: user.id, plan: input.plan },
      subscription_data: { metadata: { userId: user.id, plan: input.plan } },
    });

    if (!session.url) throw new HttpError(500, "Failed to start Stripe checkout");

    // Mark intent to pay. We only promote selectedPlan after webhook confirmation.
    await prisma.user.update({
      where: { id: user.id },
      data: { pendingPlan: input.plan },
    });

    return { url: session.url };
  },

  async handleWebhook(args: { signature: string | undefined; rawBody: Buffer }) {
    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new HttpError(500, "Stripe webhook secret is not configured");
    }

    const stripe = getStripe();

    if (!args.signature) throw new HttpError(400, "Missing Stripe signature");

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(args.rawBody, args.signature, env.STRIPE_WEBHOOK_SECRET);
    } catch {
      throw new HttpError(400, "Invalid Stripe signature");
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = (session.metadata?.userId ?? session.client_reference_id) as string | undefined;
        const plan = session.metadata?.plan as "pro" | "enterprise" | undefined;

        const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
        const customerId = typeof session.customer === "string" ? session.customer : null;

        if (!userId || !plan || !subscriptionId || !customerId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const shouldActivate = isActiveSubscriptionStatus(subscription.status);

        await prisma.user.update({
          where: { id: userId },
          data: {
            ...(shouldActivate ? { selectedPlan: plan, pendingPlan: null } : {}),
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: subscription.status,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }

      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userIdFromMeta = subscription.metadata?.userId;
        const plan = subscription.metadata?.plan as "pro" | "enterprise" | undefined;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : null;

        if (!plan) break;

        const where = userIdFromMeta ? { id: userIdFromMeta } : { stripeSubscriptionId: subscription.id };

        await prisma.user.updateMany({
          where,
          data: {
            selectedPlan: plan,
            pendingPlan: null,
            stripeCustomerId: customerId ?? undefined,
            stripeSubscriptionId: subscription.id,
            stripeSubscriptionStatus: subscription.status,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userIdFromMeta = sub.metadata?.userId;
        const where = userIdFromMeta ? { id: userIdFromMeta } : { stripeSubscriptionId: sub.id };

        await prisma.user.updateMany({
          where,
          data: {
            stripeSubscriptionId: sub.id,
            stripeSubscriptionStatus: sub.status,
            stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
        break;
      }

      default:
        break;
    }

    return { received: true };
  },
};

