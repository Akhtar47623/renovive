import cors from "cors";
import express from "express";
import { router } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { billingController } from "./controllers/billing.controller.js";

export function createApp() {
  const app = express();

  app.use(cors());

  // Stripe webhooks require the raw request body for signature verification.
  app.post("/api/v1/billing/webhook", express.raw({ type: "application/json" }), billingController.webhook);

  app.use(express.json());

  app.use("/api", router);

  app.use(errorMiddleware);

  return app;
}

