import { NextRequest } from "next/server";
import { categoryService } from "@/lib/application/services/category.service";
import { updateCategorySchema } from "@/lib/application/validators/category.validators";
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
    const category = await categoryService.getCategoryById(id);
    return successResponse(category);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error instanceof Error && error.message === "Category not found") {
      return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.CATEGORY}:${ACTIONS.UPDATE}`);
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    const category = await categoryService.updateCategory(id, validatedData, user.id);

    return successResponse(category, "Category updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "Category not found") {
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
    await requirePermission(`${RESOURCES.CATEGORY}:${ACTIONS.DELETE}`);
    const { id } = await params;
    const result = await categoryService.deleteCategory(id, user.id);
    return successResponse(result, "Category deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "Category not found") {
        return errorResponse(error.message, 404);
      }
    }
    return handleApiError(error);
  }
}
