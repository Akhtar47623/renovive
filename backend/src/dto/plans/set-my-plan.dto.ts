import { z } from "zod";

export const setMyPlanDtoSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"]),
});

export type SetMyPlanDto = z.infer<typeof setMyPlanDtoSchema>;

export function parseSetMyPlanDto(input: unknown): SetMyPlanDto {
  return setMyPlanDtoSchema.parse(input);
}

