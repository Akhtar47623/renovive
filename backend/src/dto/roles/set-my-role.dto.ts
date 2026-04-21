import { z } from "zod";

export const setMyRoleDtoSchema = z.object({
  // Frontend roles: user | contractor | admin
  role: z.enum(["user", "contractor", "admin"]),
});

export type SetMyRoleDto = z.infer<typeof setMyRoleDtoSchema>;

export function parseSetMyRoleDto(input: unknown): SetMyRoleDto {
  return setMyRoleDtoSchema.parse(input);
}

