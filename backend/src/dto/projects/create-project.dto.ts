import { z } from "zod";

/**
 * Project create DTO.
 *
 * Note: the frontend currently posts "address" and other renovation fields.
 * To stay backward compatible (and avoid 500s), we accept either "title" or "address"
 * and normalize into the DB shape (title/description/budget).
 */
export const createProjectDtoSchema = z
  .object({
    // DB fields
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    budget: z.number().optional(),

    // Frontend (current) fields
    address: z.string().min(1).optional(),
    purchasePrice: z.number().optional(),
    designStyle: z.string().optional(),
  })
  .passthrough()
  .transform((v) => {
    const title = (v.title ?? v.address ?? "Untitled Project").trim();
    const description = v.description ?? v.designStyle;
    const budget = v.budget ?? v.purchasePrice;
    return {
      title,
      description,
      budget,
    };
  });

export type CreateProjectDto = z.infer<typeof createProjectDtoSchema>;

export function parseCreateProjectDto(input: unknown): CreateProjectDto {
  return createProjectDtoSchema.parse(input);
}

