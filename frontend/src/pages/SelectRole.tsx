import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import prop2 from "@/assets/prop2.png";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const roles = [
  { value: "contractor" as const, label: "Contractor" },
  { value: "user" as const, label: "User" },
];

const SelectRolePage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const handleContinue = () => {
    if (!selected) return;
    // If user is already logged in (post-login role selection),
    // set role on backend then hard-navigate to refresh RBAC state.
    if (user) {
      void (async () => {
        try {
          await apiFetch("/roles/me", {
            method: "POST",
            body: JSON.stringify({ role: selected }),
          });
          toast.success("Role updated");
          window.location.assign(selected === "contractor" ? "/choose-plan" : "/dashboard");
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Failed to set role");
        }
      })();
      return;
    }

    // Signup flow: carry role into signup screen
    navigate(`/signup?role=${encodeURIComponent(selected)}`);
  };

  return (
    <div className="h-screen overflow-hidden grid md:grid-cols-2 bg-white font-sans">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center p-12 overflow-hidden">
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-gray-900 mb-9 block"
          >
            ReNoVIVE
          </Link>

          {/* Heading */}
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
            Select Your Role
          </h1>
          <p className="text-[13px] text-gray-400 mt-1.5 mb-6">
            Choose how you want to continue
          </p>

          {/* ROLE OPTIONS */}
          <div className="space-y-3 mb-6">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelected(role.value)}
                className={`w-full flex items-center gap-3 h-[46px] px-4 rounded-xl border text-left transition-all ${
                  selected === role.value
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* radio */}
                <span
                  className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                    selected === role.value
                      ? "border-gray-900"
                      : "border-gray-300"
                  }`}
                >
                  {selected === role.value && (
                    <span className="w-2 h-2 bg-gray-900 rounded-full" />
                  )}
                </span>

                <span className="text-sm font-medium text-gray-800">
                  {role.label}
                </span>
              </button>
            ))}
          </div>

          {/* BUTTON */}
          <div className="flex items-center gap-1">
        {/* Main Button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="flex-1 h-[46px] bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-semibold transition-colors disabled:opacity-40"
        >
          Next
        </button>

        {/* Separate Arrow Circle */}
        <div className="w-[46px] h-[46px] rounded-full bg-gray-900 flex items-center justify-center text-white">
          <ArrowUpRight size={16} />
        </div>
      </div>

          {/* LOGIN LINK */}
          <p className="text-center text-[13px] text-gray-400 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden md:block relative rounded-2xl overflow-hidden mt-4 mb-4 mr-4">
        <img
          src={prop2}
          alt="Property"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SelectRolePage;