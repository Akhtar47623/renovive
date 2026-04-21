import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import heroImage from "@/assets/prop2.png";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

const OtpVerification = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 0) return;

    e.preventDefault();

    const next = Array.from({ length: 6 }, (_, i) => digits[i] ?? "");
    setOtp(next);

    const focusIndex = Math.min(digits.length, 6) - 1;
    if (focusIndex >= 0) {
      inputsRef.current[focusIndex]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    if (!email) {
      toast.error("Missing email. Please go back and try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch<{ ok: true; resetToken: string }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp: code }),
      });
      toast.success("OTP verified");
      navigate(`/reset-password?email=${encodeURIComponent(email)}&resetToken=${encodeURIComponent(res.resetToken)}`);
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;

    if (!email) {
      toast.error("Missing email. Please go back and try again.");
      return;
    }
    setTimer(30);
    apiFetch<{ ok: true }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        void res;
        toast.success("OTP resent");
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to resend OTP"));
  };

  return (
    <div className="h-screen overflow-hidden grid md:grid-cols-2 bg-white font-sans">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center p-12">
        <div className="w-full max-w-md">

          {/* Back */}
          <Link
            to="/forgot-password"
            className="text-xs text-gray-500 mb-8 inline-flex items-center gap-2 hover:text-gray-900"
          >
            ← Back
          </Link>

          {/* Heading */}
          <h1 className="text-[28px] font-bold text-gray-900">
            Enter OTP
          </h1>
          <p className="text-[13px] text-gray-400 mt-1.5 mb-6">
            We have sent an OTP code to{" "}
            <span className="font-medium text-gray-700">{email ?? "your email"}</span> to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* OTP INPUTS */}
            <div className="flex gap-2" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  className="w-[48px] h-[48px] text-center text-lg border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                />
              ))}
            </div>

            {/* BUTTON ROW */}
            <div className="flex items-center gap-3 pt-2">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-[46px] bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
              >
                {loading ? "Verifying..." : "Submit"}
              </button>

              <div className="w-[46px] h-[46px] rounded-full bg-gray-900 flex items-center justify-center text-white cursor-pointer hover:bg-gray-800 transition">
                <ArrowUpRight size={16} />
              </div>
            </div>

            {/* RESEND */}
            <p className="text-xs text-gray-400 text-center">
              Resend it?{" "}
              <span
                onClick={handleResend}
                className={`cursor-pointer ${
                  timer > 0 ? "text-gray-300" : "text-gray-700 hover:underline"
                }`}
              >
                {timer > 0 ? `00:${timer}` : "Resend"}
              </span>
            </p>

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

export default OtpVerification;