import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { billingController } from "../../controllers/billing.controller.js";

export const billingRoutes = Router();

// Starts a Stripe Checkout Session for a subscription.
billingRoutes.post("/checkout-session", requireAuth, billingController.createCheckoutSession);

