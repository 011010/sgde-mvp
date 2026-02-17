import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50).optional(),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const searchRolesSchema = z.object({
  query: z.string().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const updateRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string()),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type SearchRolesInput = z.infer<typeof searchRolesSchema>;
export type UpdateRolePermissionsInput = z.infer<typeof updateRolePermissionsSchema>;
