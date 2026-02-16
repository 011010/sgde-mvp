import { hash, compare } from "bcrypt";
import prisma from "@/lib/infrastructure/database/prisma";
import { RegisterInput, ChangePasswordInput } from "@/lib/application/validators/auth.validators";
import { DEFAULT_ROLES } from "@/config/permissions.config";
import { logger } from "@/utils/logger";

const SALT_ROUNDS = 10;

export class AuthService {
  async registerUser(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await hash(data.password, SALT_ROUNDS);

    const studentRole = await prisma.role.findUnique({
      where: { name: DEFAULT_ROLES.STUDENT },
    });

    if (!studentRole) {
      throw new Error("Default role not found. Please run database seed.");
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        userRoles: {
          create: {
            roleId: studentRole.id,
          },
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    logger.info("User registered successfully", {
      userId: user.id,
      email: user.email,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new Error("User not found or password not set");
    }

    const isCurrentPasswordValid = await compare(data.currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedNewPassword = await hash(data.newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
      },
    });

    logger.info("Password changed successfully", { userId });

    return { success: true };
  }

  async getUserWithRolesAndPermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const roles = user.userRoles.map(
      (ur: { role: { id: string; name: string; description: string | null } }) => ({
        id: ur.role.id,
        name: ur.role.name,
        description: ur.role.description,
      })
    );

    const permissions = user.userRoles.flatMap(
      (ur: {
        role: {
          rolePermissions: {
            permission: { id: string; name: string; resource: string; action: string };
          }[];
        };
      }) =>
        ur.role.rolePermissions.map(
          (rp: { permission: { id: string; name: string; resource: string; action: string } }) => ({
            id: rp.permission.id,
            name: rp.permission.name,
            resource: rp.permission.resource,
            action: rp.permission.action,
          })
        )
    );

    const uniquePermissions = Array.from(
      new Map(
        permissions.map((p: { id: string; name: string; resource: string; action: string }) => [
          p.id,
          p,
        ])
      ).values()
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      roles,
      permissions: uniquePermissions,
    };
  }
}

export const authService = new AuthService();
