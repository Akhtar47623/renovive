import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["1 Project", "Basic Support", "5GB Storage", "Email Notifications"],
    value: "free",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    features: ["10 Projects", "Priority Support", "50GB Storage", "Analytics Dashboard", "File Uploads"],
    value: "pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: ["Unlimited Projects", "24/7 Support", "500GB Storage", "Advanced Analytics", "API Access", "Custom Branding"],
    value: "enterprise",
  },
];

const ChoosePlanPage = () => {
  const [selected, setSelected] = useState("free");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContinue = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ selected_plan: selected })
      .eq("user_id", user.id);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${selected.charAt(0).toUpperCase() + selected.slice(1)} plan selected!`);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">Select the plan that fits your needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <button
              key={plan.value}
              onClick={() => setSelected(plan.value)}
              className={`relative p-6 rounded-lg border-2 transition-all text-left ${
                selected === plan.value
                  ? "border-accent bg-accent/5 shadow-lg"
                  : "border-border bg-card hover:border-accent/50"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h3 className="font-serif text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-accent shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
        <div className="text-center">
          <Button variant="hero" size="lg" onClick={handleContinue} disabled={loading}>
            {loading ? "Saving..." : "Get Started"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlanPage;
