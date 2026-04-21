import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import heroImage from "@/assets/prop2.png";
import { ArrowLeft, ArrowUpRight, Eye, EyeOff } from "lucide-react";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, refreshMe } = useAuth();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role");

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }
    if (!role) {
      toast.error("Please select a role first");
      navigate("/select-role");
      return;
    }
    setLoading(true);
    try {
      await signUp({ email, password, fullName: name });
      await apiFetch<{ role: string }>("/roles/me", {
        method: "POST",
        body: JSON.stringify({ role }),
      });
      await refreshMe();
      toast.success("Account created!");
      navigate(role === "contractor" ? "/choose-plan" : "/dashboard/projects", { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden grid md:grid-cols-2 bg-white">
      {/* Left — Form */}
      <div className="flex items-center justify-center px-10 py-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          {/* Logo */}
          <Link to="/" className="font-serif text-xl font-bold text-foreground block mb-6 tracking-wide">
            ReNoVIVE
          </Link>

          <h1 className="text-2xl font-bold text-foreground mb-0.5">Sign Up</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Please enter the information to create an account.
          </p>

          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <Input
                placeholder="Perry Wilson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl bg-white border border-gray-200 h-10 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email Address</label>
              <Input
                type="email"
                placeholder="perry.wilson@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl bg-white border border-gray-200 h-10 text-sm"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Phone Number</label>
              <Input
                type="tel"
                placeholder="(219) 555–0114"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl bg-white border border-gray-200 h-10 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl bg-white border border-gray-200 h-10 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 ">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-black cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I Agree the{" "}
                <span className="font-semibold text-foreground">Terms &amp; Conditions</span>
              </label>
            </div>

            {/* Signup button + arrow outside */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-black text-white text-sm font-medium py-2.5 rounded-full hover:bg-gray-900 transition-colors disabled:opacity-60"
              >
                {loading ? "Creating..." : "Signup"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-60 flex-shrink-0"
              >
                <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-muted-foreground">Or sign up with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-sm font-medium text-foreground hover:bg-gray-50 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-foreground hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right — Hero image */}
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

export default SignupPage;