import prisma from "@/lib/infrastructure/database/prisma";
import { SearchAuditLogsInput } from "@/lib/application/validators/audit.validators";

export class AuditLogService {
  async searchAuditLogs(filters: SearchAuditLogsInput) {
    const where: {
      AND?: object[];
      userId?: string;
      resource?: string;
      action?: string;
    } = {};

    const conditions: object[] = [];

    if (filters.query) {
      conditions.push({
        OR: [
          { details: { contains: filters.query, mode: "insensitive" } },
          { resource: { contains: filters.query, mode: "insensitive" } },
          { action: { contains: filters.query, mode: "insensitive" } },
        ],
      });
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.resource) {
      where.resource = filters.resource;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.startDate || filters.endDate) {
      const dateFilter: { gte?: Date; lte?: Date } = {};
      if (filters.startDate) {
        dateFilter.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        dateFilter.lte = new Date(filters.endDate);
      }
      conditions.push({ createdAt: dateFilter });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: {
          [filters.sortBy]: filters.sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getAuditLogById(logId: string) {
    const log = await prisma.auditLog.findUnique({
      where: { id: logId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!log) {
      throw new Error("Audit log not found");
    }

    return log;
  }

  async getResources() {
    const resources = await prisma.auditLog.groupBy({
      by: ["resource"],
      _count: {
        resource: true,
      },
    });

    return resources.map((r) => r.resource);
  }

  async getActions() {
    const actions = await prisma.auditLog.groupBy({
      by: ["action"],
      _count: {
        action: true,
      },
    });

    return actions.map((a) => a.action);
  }
}

export const auditLogService = new AuditLogService();
