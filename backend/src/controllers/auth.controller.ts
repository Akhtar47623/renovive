import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { parseLoginDto } from "../dto/auth/login.dto.js";
import { parseSignUpDto } from "../dto/auth/signup.dto.js";
import { parseForgotPasswordDto } from "../dto/auth/forgot-password.dto.js";
import { parseVerifyOtpDto } from "../dto/auth/verify-otp.dto.js";
import { parseResetPasswordDto } from "../dto/auth/reset-password.dto.js";

export const authController = {
  signup: asyncHandler(async (req: Request, res: Response) => {
    const input = parseSignUpDto(req.body);
    const result = await authService.signup(input);
    if (!result.ok) {
      res.status(409).json({ error: result.error });
      return;
    }
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const input = parseLoginDto(req.body);
    const result = await authService.login(input);
    if (!result.ok) {
      res.status(401).json({ error: result.error });
      return;
    }
    res.json(result);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req as AuthenticatedRequest;
    const me = await authService.me(userId);
    if (!me) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(me);
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    const input = parseForgotPasswordDto(req.body);
    const result = await authService.forgotPassword(input);
    if (!result.ok) {
      res.status(404).json({ error: result.error });
      return;
    }
    res.json(result);
  }),

  verifyPasswordOtp: asyncHandler(async (req: Request, res: Response) => {
    const input = parseVerifyOtpDto(req.body);
    const result = await authService.verifyPasswordOtp(input);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.json(result);
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const input = parseResetPasswordDto(req.body);
    const result = await authService.resetPassword(input);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.json(result);
  }),
};

