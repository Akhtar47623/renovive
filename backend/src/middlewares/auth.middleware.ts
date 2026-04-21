import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AuthenticatedRequest = Request & { userId: string };

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization") ?? "";
  const [, token] = header.split(" ");
  if (!token) {
    res.status(401).json({ error: "Missing Authorization header" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (!payload || typeof payload !== "object" || typeof (payload as any).sub !== "string") {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    (req as AuthenticatedRequest).userId = (payload as any).sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

