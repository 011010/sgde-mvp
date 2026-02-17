import { NextRequest } from "next/server";
import { changePasswordSchema } from "@/lib/application/validators/settings.validators";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";
import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";
import { compare, hash } from "bcrypt";

const SALT_ROUNDS = 12;

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!userData || !userData.password) {
      return errorResponse("User not found or OAuth account", 400);
    }

    const isValidPassword = await compare(validatedData.currentPassword, userData.password);

    if (!isValidPassword) {
      return errorResponse("Current password is incorrect", 400);
    }

    const hashedNewPassword = await hash(validatedData.newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "update",
        resource: "user",
        resourceId: user.id,
        details: "Changed password",
      },
    });

    logger.info("User password changed", {
      userId: user.id,
    });

    return successResponse({ success: true }, "Password changed successfully");
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}
