import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "./types";

export function RequireRole(props: { allowed: Role[]; children: ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/select-role" replace />;
  if (!props.allowed.includes(role)) return <Navigate to="/dashboard" replace />;

  return <>{props.children}</>;
}

