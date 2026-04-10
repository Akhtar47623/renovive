import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Hammer, Users } from "lucide-react";

const roles = [
  { value: "homeowner" as const, label: "Homeowner", icon: Home, description: "I want to renovate my property" },
  { value: "contractor" as const, label: "Contractor", icon: Hammer, description: "I provide renovation services" },
  { value: "agent" as const, label: "Agent", icon: Users, description: "I help clients find renovation services" },
];

const SelectRolePage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContinue = async () => {
    if (!selected || !user) {
      toast.error("Please select a role");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("user_roles").insert({
      user_id: user.id,
      role: selected as "homeowner" | "contractor" | "agent",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Role selected!");
      navigate("/choose-plan");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Select Your Role</h1>
          <p className="text-muted-foreground">Choose the option that best describes you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelected(role.value)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                selected === role.value
                  ? "border-accent bg-accent/5 shadow-lg"
                  : "border-border bg-card hover:border-accent/50"
              }`}
            >
              <role.icon className={`mb-3 ${selected === role.value ? "text-accent" : "text-muted-foreground"}`} size={28} />
              <h3 className="font-serif font-semibold text-foreground mb-1">{role.label}</h3>
              <p className="text-muted-foreground text-sm">{role.description}</p>
            </button>
          ))}
        </div>
        <div className="text-center">
          <Button variant="hero" size="lg" onClick={handleContinue} disabled={!selected || loading}>
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectRolePage;
