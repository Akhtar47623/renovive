import { z } from "zod";

export const verifyOtpDtoSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpDtoSchema>;

export function parseVerifyOtpDto(input: unknown): VerifyOtpDto {
  return verifyOtpDtoSchema.parse(input);
}

