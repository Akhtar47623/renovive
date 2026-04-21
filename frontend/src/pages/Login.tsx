import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowUpRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/prop2.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sign in failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="h-screen overflow-hidden grid md:grid-cols-2 bg-white font-sans">

      {/* ── Left panel ── */}
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

          <p className="text-xl font-bold tracking-tight text-gray-900 mb-9">
            ReNoVIVE
          </p>

          <h1 className="text-[28px] font-bold text-gray-900 flex items-center gap-2 leading-tight">
            Welcome Back 👋
          </h1>
          <p className="text-[13px] text-gray-400 mt-1.5 mb-6">
            Please enter the sign in information.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="perry.wilson@example.com"
                className="w-full h-[42px] border border-gray-200 rounded-lg px-3.5 text-sm text-gray-900 outline-none focus:border-gray-400 placeholder:text-gray-300 bg-white"
              />
            </div>

            <div>
              <label className="text-[12px] text-gray-500 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[42px] border border-gray-200 rounded-lg px-3.5 pr-10 text-sm text-gray-900 outline-none focus:border-gray-400 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 text-[13px] text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-gray-900 w-3.5 h-3.5"
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-[13px] text-gray-500 hover:underline">
                Forgot Password
              </Link>
            </div>

            <div className="flex items-center gap-3 mt-1">
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-[46px] bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-semibold transition-colors"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              {/* Separate Arrow Circle */}
              <div className="w-[46px] h-[46px] rounded-full bg-gray-900 flex items-center justify-center text-white">
                <ArrowUpRight size={16} />
              </div>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4 text-[12px] text-gray-300">
            <span className="flex-1 h-px bg-gray-100" />
            Or sign in with
            <span className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="h-[42px] border border-gray-200 rounded-[9px] flex items-center justify-center gap-2 text-[13px] text-gray-700 hover:bg-gray-50 font-medium">
              {/* Full-color Google G */}
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11C42.72 36.5 45.12 30.86 45.12 24.5z"/>
                <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
                <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 002 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
                <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
              </svg>
              Google
            </button>

            <button className="h-[42px] border border-gray-200 rounded-[9px] flex items-center justify-center gap-2 text-[13px] text-gray-700 hover:bg-gray-50 font-medium">
              {/* Apple logo */}
              <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 143.5-318 284.6-318 74.4 0 136.6 49 181.9 49 44 0 113.9-52 200.7-52 32.3 0 134.8 2.8 202.8 93.1zm-170-125.8c37.4-44.1 64.2-105.3 64.2-166.6 0-8.4-.6-16.9-2.1-23.7-60.6 2.3-132.3 40.4-175.5 91-33.6 37.8-65.3 99-65.3 160.9 0 9 1.4 18 2.1 20.8 3.8.6 9.9 1.4 16 1.4 54.3 0 120.9-36.4 160.6-83.8z"/>
              </svg>
              Apple
            </button>
          </div>

          <p className="text-center text-[13px] text-gray-400 mt-5">
            Don't have an account?{" "}
            <Link to="/select-role" className="text-gray-900 font-bold hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right panel — image fills the full height ── */}
      <div className="hidden md:block relative rounded-2xl overflow-hidden mt-4 mb-4 mr-4">
        <img
          src={heroImage}
          alt="Renovive"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
};

export default LoginPage;