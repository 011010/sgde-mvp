import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  roleIds: z.array(z.string()).min(1, "At least one role is required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  email: z.string().email("Invalid email address").optional(),
  image: z.string().url("Invalid image URL").optional().nullable(),
  roleIds: z.array(z.string()).optional(),
});

export const searchUsersSchema = z.object({
  query: z.string().optional(),
  roleId: z.string().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "name", "email"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const updateUserRolesSchema = z.object({
  roleIds: z.array(z.string()).min(1, "At least one role is required"),
});

export const assignRoleSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  roleIds: z.array(z.string()).min(1, "At least one role is required"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type SearchUsersInput = z.infer<typeof searchUsersSchema>;
export type UpdateUserRolesInput = z.infer<typeof updateUserRolesSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
