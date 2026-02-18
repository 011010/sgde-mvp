import { NextRequest } from "next/server";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { documentService } from "@/lib/application/services/document.service";
import { successResponse, errorResponse, handleApiError } from "@/utils/api-response";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.DELETE}`);

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse("Document IDs are required", 400);
    }

    const results = await Promise.allSettled(
      ids.map((id) => documentService.deleteDocument(id, user.id))
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return successResponse(
      { succeeded, failed, total: ids.length },
      `Deleted ${succeeded} of ${ids.length} documents`
    );
  } catch (error) {
    return handleApiError(error);
  }
}
