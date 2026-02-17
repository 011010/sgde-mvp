import { NextRequest } from "next/server";
import { userService } from "@/lib/application/services/user.service";
import {
  updateUserSchema,
  updateUserRolesSchema,
} from "@/lib/application/validators/user.validators";
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
    const user = await userService.getUserById(id);
    return successResponse(user);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    if (error instanceof Error && error.message === "User not found") {
      return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireAuth();
    await requirePermission(`${RESOURCES.USER}:${ACTIONS.UPDATE}`);
    const { id } = await params;
    const body = await request.json();

    if (body.roleIds) {
      const validatedData = updateUserRolesSchema.parse(body);
      const user = await userService.updateUserRoles(id, validatedData, currentUser.id);
      return successResponse(user, "User roles updated successfully");
    } else {
      const validatedData = updateUserSchema.parse(body);
      const user = await userService.updateUser(id, validatedData, currentUser.id);
      return successResponse(user, "User updated successfully");
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "User not found") {
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
    const currentUser = await requireAuth();
    await requirePermission(`${RESOURCES.USER}:${ACTIONS.DELETE}`);
    const { id } = await params;
    const result = await userService.deleteUser(id, currentUser.id);
    return successResponse(result, "User deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "User not found") {
        return errorResponse(error.message, 404);
      }
      if (error.message === "Cannot delete your own account") {
        return errorResponse(error.message, 400);
      }
    }
    return handleApiError(error);
  }
}
