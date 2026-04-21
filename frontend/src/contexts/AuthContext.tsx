import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { apiFetch, clearAccessToken, getAccessToken, setAccessToken } from "@/lib/api";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

export type Role = "user" | "contractor" | "admin";
export type Plan = "free" | "pro" | "enterprise";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired" | "paused" | null;

type MeResponse = {
  user: AuthUser;
  role: unknown;
  plan?: Plan;
  pendingPlan?: Plan | null;
  subscriptionStatus?: SubscriptionStatus;
};

function normalizeRole(role: unknown): Role | null {
  if (role === "homeowner") return "user";
  if (role === "user" || role === "contractor" || role === "admin") return role;
  return null;
}

interface AuthContextType {
  user: AuthUser | null;
  role: Role | null;
  plan: Plan | null;
  pendingPlan: Plan | null;
  subscriptionStatus: SubscriptionStatus;
  loading: boolean;
  refreshMe: () => Promise<MeResponse>;
  signUp: (input: { email: string; password: string; fullName: string }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  plan: null,
  pendingPlan: null,
  subscriptionStatus: null,
  loading: true,
  refreshMe: async () => ({ user: { id: "", email: "", fullName: "" }, role: null }),
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch<MeResponse>("/auth/me")
      .then((data) => {
        setUser(data.user);
        setRole(normalizeRole(data.role));
        setPlan(data.plan ?? null);
        setPendingPlan(data.pendingPlan ?? null);
        setSubscriptionStatus(data.subscriptionStatus ?? null);
      })
      .catch(() => {
        clearAccessToken();
        setUser(null);
        setRole(null);
        setPlan(null);
        setPendingPlan(null);
        setSubscriptionStatus(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const refreshMe = useCallback(async () => {
    const me = await apiFetch<MeResponse>("/auth/me");
    setUser(me.user);
    setRole(normalizeRole(me.role));
    setPlan(me.plan ?? null);
    setPendingPlan(me.pendingPlan ?? null);
    setSubscriptionStatus(me.subscriptionStatus ?? null);
    return me;
  }, []);

  const signUp = useCallback(async (input: { email: string; password: string; fullName: string }) => {
    const res = await apiFetch<{ ok: true; user: AuthUser; tokens: { accessToken: string } }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setAccessToken(res.tokens.accessToken);
    // Ensure role is hydrated immediately after signup (or stays null if not set yet)
    try {
      await refreshMe();
    } catch {
      setUser(res.user);
      setRole(null);
      setPlan(null);
      setPendingPlan(null);
      setSubscriptionStatus(null);
    }
  }, [refreshMe]);

  const signIn = useCallback(async (input: { email: string; password: string }) => {
    const res = await apiFetch<{ ok: true; user: AuthUser; tokens: { accessToken: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setAccessToken(res.tokens.accessToken);
    // Hydrate role from backend so dashboard RBAC works right away
    await refreshMe();
  }, [refreshMe]);

  const signOut = useCallback(async () => {
    clearAccessToken();
    setUser(null);
    setRole(null);
    setPlan(null);
    setPendingPlan(null);
    setSubscriptionStatus(null);
  }, []);

  const value = useMemo(
    () => ({ user, role, plan, pendingPlan, subscriptionStatus, loading, refreshMe, signUp, signIn, signOut }),
    [user, role, plan, pendingPlan, subscriptionStatus, loading, refreshMe, signUp, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
