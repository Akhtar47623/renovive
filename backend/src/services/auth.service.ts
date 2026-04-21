import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db/index.js";
import { env } from "../config/env.js";
import type { LoginDto } from "../dto/auth/login.dto.js";
import type { SignUpDto } from "../dto/auth/signup.dto.js";
import type { AuthUserDto } from "../dto/auth/auth-user.dto.js";
import type { LoginErrorResponse, LoginOkResponse } from "../dto/auth/login.response.js";
import type { SignUpErrorResponse, SignUpOkResponse } from "../dto/auth/signup.response.js";
import type { ForgotPasswordDto } from "../dto/auth/forgot-password.dto.js";
import type { VerifyOtpDto } from "../dto/auth/verify-otp.dto.js";
import type { ResetPasswordDto } from "../dto/auth/reset-password.dto.js";
import { canResend, createOtp, upsertOtp, verifyOtp } from "./password-reset.store.js";
import { mailService } from "./mail.service.js";

function toAuthUser(u: { id: string; email: string; fullName: string }): AuthUserDto {
  return { id: u.id, email: u.email, fullName: u.fullName };
}

export const authService = {
  async signup(input: SignUpDto): Promise<SignUpOkResponse | SignUpErrorResponse> {
    try {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) {
        return { ok: false as const, error: "Email already in use" };
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      const data = {
        email: input.email,
        fullName: input.fullName,
        passwordHash,
      }

      const user = await prisma.user.create({
        data,
        select: { id: true, email: true, fullName: true },
      });

      const accessToken = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: "7d" });
      return { ok: true as const, user: toAuthUser(user), tokens: { accessToken } };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("authService.signup failed", err);
      return { ok: false as const, error: "Failed to create account" };
    }
  },

  async login(input: LoginDto): Promise<LoginOkResponse | LoginErrorResponse> {
    try {
      const userWithHash = await prisma.user.findUnique({
        where: { email: input.email },
        select: { id: true, email: true, fullName: true, passwordHash: true },
      });
      if (!userWithHash) return { ok: false as const, error: "Invalid email or password" };

      const valid = await bcrypt.compare(input.password, userWithHash.passwordHash);
      if (!valid) return { ok: false as const, error: "Invalid email or password" };

      const accessToken = jwt.sign({ sub: userWithHash.id }, env.JWT_SECRET, { expiresIn: "7d" });
      return {
        ok: true as const,
        user: toAuthUser(userWithHash),
        tokens: { accessToken },
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("authService.login failed", err);
      return { ok: false as const, error: "Failed to sign in" };
    }
  },

  async me(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          selectedPlan: true,
          pendingPlan: true,
          stripeSubscriptionStatus: true,
        },
      });
      if (!user) return null;
      const role = await prisma.userRole.findUnique({
        where: { userId },
        select: { role: true },
      });
      return {
        user: toAuthUser(user),
        role: role?.role ?? null,
        plan: user.selectedPlan,
        pendingPlan: user.pendingPlan,
        subscriptionStatus: user.stripeSubscriptionStatus ?? null,
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("authService.me failed", err);
      return null;
    }
  },

  async forgotPassword(input: ForgotPasswordDto): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
      const email = input.email.trim().toLowerCase();

      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        return { ok: false as const, error: "Email is not registered" };
      }

      const cooldownMs = 30_000;
      if (!canResend(email, cooldownMs)) {
        return { ok: true };
      }

      const otp = createOtp(email);
      upsertOtp({ email, otp, secret: env.JWT_SECRET, ttlMs: 10 * 60_000 });

      await mailService.sendPasswordResetOtp({ to: email, otp });

      return { ok: true };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("authService.forgotPassword failed", err);
      return { ok: false as const, error: "Failed to send OTP" };
    }
  },

  async verifyPasswordOtp(
    input: VerifyOtpDto
  ): Promise<{ ok: true; resetToken: string } | { ok: false; error: string }> {
    try {
      const res = verifyOtp({
        email: input.email,
        otp: input.otp,
        secret: env.JWT_SECRET,
        maxAttempts: 5,
      });
      if (!res.ok) return res;

      // OTP is now consumed. Issue a short-lived reset token.
      const resetToken = jwt.sign(
        { purpose: "password_reset", email: input.email.toLowerCase() },
        env.JWT_SECRET,
        { expiresIn: "10m" }
      );

      return { ok: true, resetToken };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("authService.verifyPasswordOtp failed", err);
      return { ok: false as const, error: "Failed to verify OTP" };
    }
  },

  async resetPassword(input: ResetPasswordDto): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
      let payload: unknown;
      try {
        payload = jwt.verify(input.resetToken, env.JWT_SECRET);
      } catch {
        return { ok: false as const, error: "Invalid or expired OTP" };
      }

      if (!payload || typeof payload !== "object") {
        return { ok: false as const, error: "Invalid or expired OTP" };
      }

      const p = payload as { purpose?: unknown; email?: unknown };
      if (p.purpose !== "password_reset" || typeof p.email !== "string") {
        return { ok: false as const, error: "Invalid or expired OTP" };
      }

      const tokenEmail = p.email.toLowerCase();
      const reqEmail = input.email.toLowerCase();
      if (tokenEmail !== reqEmail) {
        return { ok: false as const, error: "Invalid or expired OTP" };
      }

      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await prisma.user.updateMany({
        where: { email: reqEmail },
        data: { passwordHash } satisfies Prisma.UserUpdateManyMutationInput,
      });

      return { ok: true };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("authService.resetPassword failed", err);
      return { ok: false as const, error: "Failed to reset password" };
    }
  },
};

