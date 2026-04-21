import { z } from "zod";

export const signUpDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

export type SignUpDto = z.infer<typeof signUpDtoSchema>;

export function parseSignUpDto(input: unknown): SignUpDto {
  return signUpDtoSchema.parse(input);
}

