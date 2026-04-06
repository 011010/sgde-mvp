import { NextRequest } from "next/server";
import { folderService } from "@/lib/application/services/folder.service";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";
import { createFolderSchema } from "@/lib/application/validators/folder.validators";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const tree = searchParams.get("tree");

    if (tree === "true") {
      const folders = await folderService.getFolderTree();
      return successResponse(folders);
    }

    const folders = await folderService.getFolders();
    return successResponse(folders);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const data = createFolderSchema.parse(body);
    const folder = await folderService.createFolder(data, user.id);
    return createdResponse(folder, "Carpeta creada exitosamente");
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}
