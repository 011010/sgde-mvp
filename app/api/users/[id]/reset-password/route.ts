import { NextRequest } from "next/server";
import { z } from "zod";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";
import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";
import { hash } from "bcrypt";

const SALT_ROUNDS = 12;

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = await requireAuth();
    await requirePermission(`${RESOURCES.USER}:${ACTIONS.UPDATE}`);

    const { id } = await params;
    const body = await request.json();
    const { newPassword } = resetPasswordSchema.parse(body);

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return errorResponse("User not found", 404);
    }

    const hashedPassword = await hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: "update",
        resource: "user",
        resourceId: id,
        details: `Admin reset password for user ${targetUser.email}`,
      },
    });

    logger.info("Admin reset user password", { adminId: currentUser.id, targetUserId: id });

    return successResponse({ success: true }, "Password reset successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message.includes("Forbidden")) return errorResponse(error.message, 403);
    }
    return handleApiError(error);
  }
}
