import { z } from "zod";

export const projectIdParamSchema = z.object({
  id: z.string().min(1),
});

export type ProjectIdParam = z.infer<typeof projectIdParamSchema>;

export function parseProjectIdParam(input: unknown): ProjectIdParam {
  return projectIdParamSchema.parse(input);
}

