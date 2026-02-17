import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  description: z.string().max(500).optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional(),
});

export const searchCategoriesSchema = z.object({
  query: z.string().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const createTagSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Tag name must contain only lowercase letters, numbers, and hyphens"),
});

export const updateTagSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Tag name must contain only lowercase letters, numbers, and hyphens")
    .optional(),
});

export const searchTagsSchema = z.object({
  query: z.string().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type SearchCategoriesInput = z.infer<typeof searchCategoriesSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type SearchTagsInput = z.infer<typeof searchTagsSchema>;
