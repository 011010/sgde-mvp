import { NextRequest } from "next/server";
import { updateProfileSchema } from "@/lib/application/validators/settings.validators";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";
import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";

export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth();

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userData) {
      return errorResponse("User not found", 404);
    }

    return successResponse(userData);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validatedData.name,
        email: validatedData.email,
        image: validatedData.image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updatedAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "update",
        resource: "user",
        resourceId: user.id,
        details: "Updated profile information",
      },
    });

    logger.info("User profile updated", {
      userId: user.id,
    });

    return successResponse(updatedUser, "Profile updated successfully");
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}
