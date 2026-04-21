import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import heroImage from "@/assets/prop2.png";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const resetToken = searchParams.get("resetToken");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !resetToken) {
      toast.error("Missing reset context. Please restart the flow.");
      navigate("/forgot-password");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await apiFetch<{ ok: true }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, resetToken, newPassword: password }),
      });
      toast.success("Password reset successful. Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden grid md:grid-cols-2 bg-white font-sans">
      {/* LEFT SIDE */}
      <div className="flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <Link
            to="/otp-verification"
            className="text-xs text-gray-500 mb-8 inline-flex items-center gap-2 hover:text-gray-900"
          >
            ← Back
          </Link>

          <h1 className="text-[28px] font-bold text-gray-900">Reset Password</h1>
          <p className="text-[13px] text-gray-400 mt-1.5 mb-6">
            Set a new password for{" "}
            <span className="font-medium text-gray-700">{email ?? "your account"}</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[42px] border border-gray-200 rounded-lg px-3.5 text-sm text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full h-[42px] border border-gray-200 rounded-lg px-3.5 text-sm text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-[46px] bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
              >
                {loading ? "Saving..." : "Reset Password"}
              </button>

              <div className="w-[46px] h-[46px] rounded-full bg-gray-900 flex items-center justify-center text-white">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden md:block relative rounded-2xl overflow-hidden mt-4 mb-4 mr-4">
        <img src={heroImage} alt="Property" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default ResetPassword;

