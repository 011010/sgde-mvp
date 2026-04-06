import { NextRequest } from "next/server";
import { folderService } from "@/lib/application/services/folder.service";
import { successResponse, unauthorizedResponse, handleApiError } from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const path = await folderService.getFolderPath(id);
    return successResponse(path);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}
