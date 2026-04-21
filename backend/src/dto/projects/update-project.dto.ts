import { z } from "zod";

export const updateProjectDtoSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  budget: z.number().optional(),
});

export type UpdateProjectDto = z.infer<typeof updateProjectDtoSchema>;

export function parseUpdateProjectDto(input: unknown): UpdateProjectDto {
  return updateProjectDtoSchema.parse(input);
}

