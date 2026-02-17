import { NextRequest } from "next/server";
import { tagService } from "@/lib/application/services/tag.service";
import {
  createTagSchema,
  searchTagsSchema,
} from "@/lib/application/validators/category.validators";
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

    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());

    const filters = searchTagsSchema.parse({
      ...searchParams,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
    });

    const result = await tagService.searchTags(filters);

    return successResponse(result);
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
    await requirePermission(`${RESOURCES.TAG}:${ACTIONS.CREATE}`);

    const body = await request.json();
    const validatedData = createTagSchema.parse(body);

    const tag = await tagService.createTag(validatedData, user.id);

    return createdResponse(tag, "Tag created successfully");
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
