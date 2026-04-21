import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function isActive(status: unknown): boolean {
  return status === "active" || status === "trialing";
}

export function RequireSubscription(props: { children: ReactNode }) {
  const { user, role, plan, pendingPlan, subscriptionStatus, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  // Only gate contractors.
  if (role !== "contractor") return <>{props.children}</>;

  // Don't block navigation inside the dashboard shell.
  // (Stripe confirmation can lag; we still allow the user to proceed.)
  if (location.pathname.startsWith("/dashboard")) return <>{props.children}</>;

  // If they started checkout for a paid plan, or are on a paid plan, they must have an active subscription.
  const requiresPayment = (pendingPlan && pendingPlan !== "free") || (plan && plan !== "free");
  if (!requiresPayment) return <>{props.children}</>;

  if (!isActive(subscriptionStatus)) {
    return <Navigate to="/choose-plan" replace state={{ from: location.pathname }} />;
  }

  return <>{props.children}</>;
}

