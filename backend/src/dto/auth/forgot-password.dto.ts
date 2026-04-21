import { z } from "zod";

export const forgotPasswordDtoSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDtoSchema>;

export function parseForgotPasswordDto(input: unknown): ForgotPasswordDto {
  return forgotPasswordDtoSchema.parse(input);
}

