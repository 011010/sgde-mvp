import { NextRequest } from "next/server";
import { updateNotificationSettingsSchema } from "@/lib/application/validators/settings.validators";
import { successResponse, unauthorizedResponse, handleApiError } from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";

export async function GET(_request: NextRequest) {
  try {
    await requireAuth();

    return successResponse({
      emailNotifications: true,
      documentShared: true,
      documentUpdated: true,
      systemUpdates: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const validatedData = updateNotificationSettingsSchema.parse(body);

    return successResponse(
      {
        ...validatedData,
        updatedAt: new Date().toISOString(),
      },
      "Notification settings updated"
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}
