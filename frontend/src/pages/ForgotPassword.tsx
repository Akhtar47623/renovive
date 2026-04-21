import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import heroImage from "@/assets/prop2.png";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      await apiFetch<{ ok: true }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.success("OTP sent to your email");
      navigate(`/otp-verification?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden grid md:grid-cols-2 bg-white font-sans">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center p-12">
        <div className="w-full max-w-md">

          {/* Back */}
          <Link
            to="/login"
            className="text-xs text-gray-500 mb-8 inline-flex items-center gap-2 hover:text-gray-900"
          >
            ← Back
          </Link>

          {/* Heading */}
          <h1 className="text-[28px] font-bold text-gray-900">
            Forgot Password?
          </h1>
          <p className="text-[13px] text-gray-400 mt-1.5 mb-6">
            Enter your email address to receive a one time code to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="perry.wilson@example.com"
                className="w-full h-[42px] border border-gray-200 rounded-lg px-3.5 text-sm text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300"
              />
            </div>

            {/* BUTTON ROW (Button + Circle Arrow) */}
            <div className="flex items-center gap-3 pt-2">

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-[46px] bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              {/* Arrow Circle */}
              <div className="w-[46px] h-[46px] rounded-full bg-gray-900 flex items-center justify-center text-white cursor-pointer hover:bg-gray-800 transition">
                <ArrowUpRight size={16} />
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="hidden md:block relative rounded-2xl overflow-hidden mt-4 mb-4 mr-4">
        <img
          src={heroImage}
          alt="Property"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;