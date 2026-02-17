import { NextRequest } from "next/server";
import { tagService } from "@/lib/application/services/tag.service";
import { updateTagSchema } from "@/lib/application/validators/category.validators";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const tag = await tagService.getTagById(id);
    return successResponse(tag);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error instanceof Error && error.message === "Tag not found") {
      return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.TAG}:${ACTIONS.UPDATE}`);
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTagSchema.parse(body);

    const tag = await tagService.updateTag(id, validatedData, user.id);

    return successResponse(tag, "Tag updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "Tag not found") {
        return errorResponse(error.message, 404);
      }
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.TAG}:${ACTIONS.DELETE}`);
    const { id } = await params;
    const result = await tagService.deleteTag(id, user.id);
    return successResponse(result, "Tag deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "Tag not found") {
        return errorResponse(error.message, 404);
      }
    }
    return handleApiError(error);
  }
}
