import { z } from "zod";

export const searchAuditLogsSchema = z.object({
  query: z.string().optional(),
  userId: z.string().optional(),
  resource: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  sortBy: z.enum(["createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SearchAuditLogsInput = z.infer<typeof searchAuditLogsSchema>;
