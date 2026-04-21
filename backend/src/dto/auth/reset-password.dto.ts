import { z } from "zod";

export const resetPasswordDtoSchema = z.object({
  email: z.string().email(),
  resetToken: z.string().min(1),
  newPassword: z.string().min(6),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordDtoSchema>;

export function parseResetPasswordDto(input: unknown): ResetPasswordDto {
  return resetPasswordDtoSchema.parse(input);
}

