import { NextRequest } from "next/server";
import { roleService } from "@/lib/application/services/role.service";
import { createRoleSchema, searchRolesSchema } from "@/lib/application/validators/role.validators";
import {
  successResponse,
  createdResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    await requirePermission(`${RESOURCES.ROLE}:${ACTIONS.READ}`);

    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());

    const filters = searchRolesSchema.parse({
      ...searchParams,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
    });

    const result = await roleService.searchRoles(filters);

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

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.ROLE}:${ACTIONS.CREATE}`);

    const body = await request.json();
    const validatedData = createRoleSchema.parse(body);

    const role = await roleService.createRole(validatedData, user.id);

    return createdResponse(role, "Role created successfully");
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
