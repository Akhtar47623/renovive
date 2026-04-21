import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = (searchParams.get("plan") as "pro" | "enterprise" | null) ?? "enterprise";
  const canceled = searchParams.get("canceled");

  const planMeta =
    plan === "pro"
      ? { amount: "$59.00", label: "Monthly", description: "Billed Monthly" }
      : { amount: "$79.00", label: "Yearly", description: "Billed Yearly" };

  const [loading, setLoading] = useState(false);

  const handleContinueToStripe = async () => {
    setLoading(true);
    try {
      const r = await apiFetch<{ url: string }>("/billing/checkout-session", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      window.location.assign(r.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel — purple summary ── */}
      <div className="md:w-[45%] bg-[#7B5EA7] bg-[#8b5cf6]  flex flex-col px-10 py-10 text-white">

        {/* Back + Logo */}
        <div className="flex items-center gap-4 mb-14">
          <button
            onClick={() => navigate(-1)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={14} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              R
            </div>
            <span className="font-semibold text-white tracking-wide text-sm">RENOVIVE</span>
          </div>
        </div>

        {/* Plan summary */}
        <div className="mb-10">
          <p className="text-white/60 text-sm mb-1">Subscription fee</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">{planMeta.amount}</span>
            <span className="text-white/60 text-sm">{planMeta.label}</span>
          </div>
        </div>

        {/* Line items */}
        <div className="space-y-0">
          <div className="flex items-start justify-between py-5 border-b border-white/15">
            <div>
              <p className="text-sm font-medium text-white">Platform basic</p>
              <p className="text-xs text-white/50 mt-0.5">{planMeta.description}</p>
            </div>
            <span className="text-sm font-medium text-white">{planMeta.amount}</span>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-white/15">
            <span className="text-sm text-white/70">Subtotal</span>
            <span className="text-sm text-white">{planMeta.amount}</span>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-white/15">
            <span className="text-sm text-white/70">Tax</span>
            <span className="text-sm text-white/50">$0.00</span>
          </div>

          <div className="flex items-center justify-between pt-5">
            <span className="text-sm font-semibold text-white">Total due today</span>
            <span className="text-sm font-bold text-white">{planMeta.amount}</span>
          </div>
        </div>
      </div>

      {/* ── Right panel — payment form ── */}
      <div className="flex-1 bg-white flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pay securely with Stripe</h2>
            <p className="text-sm text-gray-500 mt-1">
              You’ll be redirected to Stripe to complete your {planMeta.label.toLowerCase()} subscription.
            </p>
            {canceled ? (
              <p className="text-sm text-red-600 mt-3">Checkout was canceled. You can try again anytime.</p>
            ) : null}
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{planMeta.label} plan</p>
                <p className="text-xs text-gray-500">{planMeta.description}</p>
              </div>
              <p className="text-sm font-bold text-gray-900">{planMeta.amount}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinueToStripe}
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-lg py-4 text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Continue to Stripe"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/choose-plan")}
            disabled={loading}
            className="w-full border border-gray-200 text-gray-900 rounded-lg py-4 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Change plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;