import { z } from "zod";

export const createCheckoutSessionDtoSchema = z.object({
  plan: z.enum(["pro", "enterprise"]),
});

export type CreateCheckoutSessionDto = z.infer<typeof createCheckoutSessionDtoSchema>;

export function parseCreateCheckoutSessionDto(input: unknown): CreateCheckoutSessionDto {
  return createCheckoutSessionDtoSchema.parse(input);
}

