import { z } from "zod";
import { DOCUMENT_SOURCE, DOCUMENT_STATUS, SHARE_PERMISSIONS } from "@/config/upload.config";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(1000).optional(),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.number().positive("File size must be positive"),
  mimeType: z.string().min(1, "MIME type is required"),
  fileUrl: z.string().url("Invalid file URL"),
  source: z.enum([
    DOCUMENT_SOURCE.LOCAL,
    DOCUMENT_SOURCE.GOOGLE_DRIVE,
    DOCUMENT_SOURCE.ONE_DRIVE,
    DOCUMENT_SOURCE.DROPBOX,
  ]),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z.string().max(1000).optional(),
  status: z
    .enum([DOCUMENT_STATUS.ACTIVE, DOCUMENT_STATUS.ARCHIVED, DOCUMENT_STATUS.DELETED])
    .optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export const shareDocumentSchema = z.object({
  documentId: z.string().cuid("Invalid document ID"),
  sharedWith: z.string().email("Invalid email address"),
  permission: z.enum([SHARE_PERMISSIONS.VIEW, SHARE_PERMISSIONS.EDIT, SHARE_PERMISSIONS.ADMIN]),
  expiresAt: z.string().datetime().optional(),
});

export const searchDocumentsSchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  source: z
    .enum([
      DOCUMENT_SOURCE.LOCAL,
      DOCUMENT_SOURCE.GOOGLE_DRIVE,
      DOCUMENT_SOURCE.ONE_DRIVE,
      DOCUMENT_SOURCE.DROPBOX,
    ])
    .optional(),
  status: z
    .enum([DOCUMENT_STATUS.ACTIVE, DOCUMENT_STATUS.ARCHIVED, DOCUMENT_STATUS.DELETED])
    .optional(),
  uploadedBy: z.string().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "fileSize"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
export type SearchDocumentsInput = z.infer<typeof searchDocumentsSchema>;
