import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

let verified: Promise<void> | null = null;
async function verifyTransportOnce() {
  if (!verified) {
    verified = transporter.verify().then(() => undefined);
  }
  return verified;
}

export const mailService = {
  async sendPasswordResetOtp(params: { to: string; otp: string }) {
    await verifyTransportOnce();
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: params.to,
      subject: "Your Renovive password reset code",
      text: `Your Renovive password reset code is: ${params.otp}\n\nThis code expires in 10 minutes.`,
    });
  },
};

