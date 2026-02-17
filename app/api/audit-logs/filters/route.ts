import { NextRequest } from "next/server";
import { auditLogService } from "@/lib/application/services/audit.service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function GET(_request: NextRequest) {
  try {
    await requireAuth();
    await requirePermission(`${RESOURCES.AUDIT_LOG}:${ACTIONS.READ}`);

    const [resources, actions] = await Promise.all([
      auditLogService.getResources(),
      auditLogService.getActions(),
    ]);

    return successResponse({ resources, actions });
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
