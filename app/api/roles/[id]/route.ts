import { NextRequest } from "next/server";
import { roleService } from "@/lib/application/services/role.service";
import {
  updateRoleSchema,
  updateRolePermissionsSchema,
} from "@/lib/application/validators/role.validators";
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
    await requirePermission(`${RESOURCES.ROLE}:${ACTIONS.READ}`);
    const { id } = await params;
    const role = await roleService.getRoleById(id);
    return successResponse(role);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "Role not found") {
        return errorResponse(error.message, 404);
      }
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.ROLE}:${ACTIONS.UPDATE}`);
    const { id } = await params;
    const body = await request.json();

    if (body.permissionIds) {
      const validatedData = updateRolePermissionsSchema.parse(body);
      const role = await roleService.updateRolePermissions(id, validatedData, user.id);
      return successResponse(role, "Role permissions updated successfully");
    } else {
      const validatedData = updateRoleSchema.parse(body);
      const role = await roleService.updateRole(id, validatedData, user.id);
      return successResponse(role, "Role updated successfully");
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "Role not found") {
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
    await requirePermission(`${RESOURCES.ROLE}:${ACTIONS.DELETE}`);
    const { id } = await params;
    const result = await roleService.deleteRole(id, user.id);
    return successResponse(result, "Role deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
      if (error.message === "Role not found") {
        return errorResponse(error.message, 404);
      }
    }
    return handleApiError(error);
  }
}
