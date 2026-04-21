import crypto from "crypto";

type ResetEntry = {
  otpHash: string;
  expiresAtMs: number;
  attempts: number;
  lastSentAtMs: number;
};

const store = new Map<string, ResetEntry>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashOtp(email: string, otp: string, secret: string) {
  return crypto.createHash("sha256").update(`${normalizeEmail(email)}:${otp}:${secret}`).digest("hex");
}

export function createOtp(email: string) {
  const otp = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  return otp;
}

export function upsertOtp(params: {
  email: string;
  otp: string;
  secret: string;
  ttlMs: number;
  nowMs?: number;
}) {
  const now = params.nowMs ?? Date.now();
  const email = normalizeEmail(params.email);
  const entry: ResetEntry = {
    otpHash: hashOtp(email, params.otp, params.secret),
    expiresAtMs: now + params.ttlMs,
    attempts: 0,
    lastSentAtMs: now,
  };
  store.set(email, entry);
}

export function canResend(email: string, cooldownMs: number, nowMs = Date.now()) {
  const entry = store.get(normalizeEmail(email));
  if (!entry) return true;
  return nowMs - entry.lastSentAtMs >= cooldownMs;
}

export function verifyOtp(params: { email: string; otp: string; secret: string; maxAttempts: number; nowMs?: number }) {
  const now = params.nowMs ?? Date.now();
  const email = normalizeEmail(params.email);
  const entry = store.get(email);
  if (!entry) return { ok: false as const, error: "Invalid or expired OTP" };

  if (now > entry.expiresAtMs) {
    store.delete(email);
    return { ok: false as const, error: "Invalid or expired OTP" };
  }

  if (entry.attempts >= params.maxAttempts) {
    store.delete(email);
    return { ok: false as const, error: "Too many attempts. Please request a new OTP." };
  }

  entry.attempts += 1;
  const expected = entry.otpHash;
  const got = hashOtp(email, params.otp, params.secret);
  if (got !== expected) {
    return { ok: false as const, error: "Invalid or expired OTP" };
  }

  store.delete(email);
  return { ok: true as const };
}

