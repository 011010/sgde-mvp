import { NextRequest } from "next/server";
import { auditLogService } from "@/lib/application/services/audit.service";
import { searchAuditLogsSchema } from "@/lib/application/validators/audit.validators";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await requirePermission(`${RESOURCES.AUDIT_LOG}:${ACTIONS.READ}`);

    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());

    const filters = searchAuditLogsSchema.parse({
      ...searchParams,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
    });

    const result = await auditLogService.searchAuditLogs(filters);

    return successResponse(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
    }
    return handleApiError(error);
  }
}
