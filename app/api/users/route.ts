import { NextRequest } from "next/server";
import { userService } from "@/lib/application/services/user.service";
import { searchUsersSchema } from "@/lib/application/validators/user.validators";
import { successResponse, unauthorizedResponse, handleApiError } from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());

    const filters = searchUsersSchema.parse({
      ...searchParams,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
    });

    const result = await userService.searchUsers(filters);

    return successResponse(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}
