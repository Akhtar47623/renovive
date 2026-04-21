import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const title = useMemo(() => (sessionId ? "Payment received" : "Payment received"), [sessionId]);

  useEffect(() => {
    toast.success("Subscription payment completed");
  }, []);

  useEffect(() => {
    // Redirect immediately after returning from Stripe.
    navigate("/dashboard/projects", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-600 mt-2">
          Thanks! We’re activating your contractor subscription now.
        </p>
        <p className="text-sm text-gray-600 mt-3">Redirecting to your dashboard…</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/projects", { replace: true })}
            className="flex-1 bg-gray-900 text-white rounded-lg py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Go to dashboard
          </button>
          <Link
            to="/choose-plan"
            className="flex-1 text-center border border-gray-200 text-gray-900 rounded-lg py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            View plans
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

