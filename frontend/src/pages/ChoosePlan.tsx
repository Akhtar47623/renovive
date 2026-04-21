import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Check, ArrowUpRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import prop2 from "@/assets/prop2.png";

const plans = [
  {
    name: "Monthly Plan",
    price: "$59",
    period: "/ month",
    features: ["1 Benefit", "2 Benefit", "3 Benefit"],
    value: "pro",
    popular: false,
  },
  {
    name: "Yearly Plan",
    price: "$79",
    period: "/ month",
    features: ["1 Benefit", "2 Benefit", "3 Benefit"],
    value: "enterprise",
    popular: true,
  },
];

const ChoosePlanPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, pendingPlan, subscriptionStatus } = useAuth();

  useEffect(() => {
    apiFetch<{ role: string | null }>("/roles/me")
      .then((r) => {
        setRole(r.role);
        if (r.role && r.role !== "contractor") {
          navigate("/dashboard", { replace: true });
        }
      })
      .catch(() => setRole(null));
  }, [navigate]);

  useEffect(() => {
    if (pendingPlan && pendingPlan !== "free" && subscriptionStatus !== "active" && subscriptionStatus !== "trialing") {
      toast.message("Complete payment to continue", {
        description: "Your contractor subscription is pending. Please finish Stripe checkout.",
      });
    }
  }, [pendingPlan, subscriptionStatus]);

  useEffect(() => {
    if (subscriptionStatus === "active" || subscriptionStatus === "trialing") {
      navigate("/dashboard/projects", { replace: true });
    }
  }, [subscriptionStatus, navigate]);

  const handleContinue = async () => {
    if (!user) return;
    if (!selected) { toast.error("Please select a plan"); return; }
    if (role === "contractor" && selected !== "free") {
      navigate(`/checkout?plan=${encodeURIComponent(selected)}`);
      return;
    }
    setLoading(true);
    try {
      await apiFetch<{ plan: string }>("/plans/me", {
        method: "POST",
        body: JSON.stringify({ plan: selected }),
      });
      toast.success("Plan selected!");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await apiFetch<{ plan: string }>("/plans/me", {
        method: "POST",
        body: JSON.stringify({ plan: "free" }),
      });
      navigate("/dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to skip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left panel ── */}
      <div className="flex-1 flex flex-col px-8 md:px-12 lg:px-16 py-12 bg-white">

        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-2xl font-bold text-gray-900 tracking-wide block mb-0"
        >
          ReNoVIVE
        </Link>

        {/* Centered content */}
        <div className="flex flex-col flex-1 items-center justify-center">
          <div className="w-full max-w-[560px]">

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
              Choose Your Plan
            </h1>
            <p className="text-gray-400 text-base mb-10">
              Unlock the full potential of Renovive with our premium features.
            </p>

            {/* Plan cards */}
            <div className="grid grid-cols-2 gap-5 mb-7">
              {plans.map((plan) => (
                <div
                  key={plan.value}
                  onClick={() => setSelected(plan.value)}
                  className={`relative rounded-2xl border cursor-pointer transition-all flex flex-col p-6 ${
                    selected === plan.value
                      ? "border-violet-300 bg-violet-50/60 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {/* Name + badge row */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <p className="text-base font-semibold text-gray-700">
                      {plan.name}
                    </p>
                    {plan.popular && (
                      <span className="bg-violet-500 text-white text-[11px] font-semibold px-3 py-0.5 rounded-full whitespace-nowrap">
                        Recommended
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-sm text-gray-400">{plan.period}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 mb-5" />

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <Check
                          size={15}
                          className="text-violet-500 shrink-0"
                          strokeWidth={3}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Select button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(plan.value);
                    }}
                    className={`w-full rounded-full border py-3 text-sm font-medium transition-colors ${
                      selected === plan.value
                        ? "border-gray-900 text-gray-900 bg-white"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Select plan
                  </button>
                </div>
              ))}
            </div>

            {/* Secure Payment */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-gray-400">Secure Payment</span>
              <button
                type="button"
                onClick={() => {
                  const plan = selected ?? "enterprise";
                  navigate(`/checkout?plan=${encodeURIComponent(plan)}`);
                }}
                className="text-sm font-bold tracking-tight hover:underline"
                style={{ color: "#635BFF" }}
              >
                stripe
              </button>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 bg-gray-900 text-white rounded-full px-6 py-4 text-base font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 text-center"
              >
                {loading ? "Saving..." : "Skip, Do it Later"}
              </button>
              <button
                onClick={selected ? handleContinue : handleSkip}
                disabled={loading}
                className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-40 shrink-0"
              >
                <ArrowUpRight size={18} className="text-white" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Right panel — photo ── */}
      <div className="hidden md:flex w-[46%] lg:w-[48%] p-5 lg:p-6 shrink-0">
        <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden">
          <img
            src={prop2}
            alt="Modern luxury home exterior"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

    </div>
  );
};

export default ChoosePlanPage;