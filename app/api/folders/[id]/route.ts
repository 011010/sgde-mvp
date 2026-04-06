import { NextRequest } from "next/server";
import { folderService } from "@/lib/application/services/folder.service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";
import { updateFolderSchema } from "@/lib/application/validators/folder.validators";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const folder = await folderService.getFolderById(id);
    return successResponse(folder);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message === "Folder not found") return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = updateFolderSchema.parse(body);
    const folder = await folderService.updateFolder(id, data, user.id);
    return successResponse(folder, "Carpeta actualizada exitosamente");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message === "Folder not found") return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const result = await folderService.deleteFolder(id, user.id);
    return successResponse(result, "Carpeta eliminada exitosamente");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message === "Folder not found") return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}
