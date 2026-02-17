import prisma from "@/lib/infrastructure/database/prisma";
import {
  SearchUsersInput,
  UpdateUserInput,
  UpdateUserRolesInput,
} from "@/lib/application/validators/user.validators";
import { logger } from "@/utils/logger";

export class UserService {
  async searchUsers(filters: SearchUsersInput) {
    const where: {
      OR?: object[];
      userRoles?: object;
    } = {};

    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: "insensitive" } },
        { email: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    if (filters.roleId) {
      where.userRoles = {
        some: {
          roleId: filters.roleId,
        },
      };
    }

    const skip = (filters.page - 1) * filters.limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: {
          [filters.sortBy]: filters.sortOrder,
        },
        include: {
          userRoles: {
            include: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateUser(userId: string, data: UpdateUserInput, currentUserId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        image: data.image,
      },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: currentUserId,
        action: "update",
        resource: "user",
        resourceId: userId,
        details: `Updated user: ${user.name || user.email}`,
      },
    });

    logger.info("User updated", {
      userId,
      updatedBy: currentUserId,
    });

    return user;
  }

  async updateUserRoles(userId: string, data: UpdateUserRolesInput, currentUserId: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    await prisma.$transaction([
      prisma.userRole.deleteMany({
        where: { userId },
      }),
      ...data.roleIds.map((roleId) =>
        prisma.userRole.create({
          data: {
            userId,
            roleId,
          },
        })
      ),
    ]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: currentUserId,
        action: "update",
        resource: "user",
        resourceId: userId,
        details: `Updated roles for user: ${user?.name || user?.email}`,
      },
    });

    logger.info("User roles updated", {
      userId,
      updatedBy: currentUserId,
      roleIds: data.roleIds,
    });

    return user;
  }

  async deleteUser(userId: string, currentUserId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.id === currentUserId) {
      throw new Error("Cannot delete your own account");
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    await prisma.auditLog.create({
      data: {
        userId: currentUserId,
        action: "delete",
        resource: "user",
        resourceId: userId,
        details: `Deleted user: ${user.name || user.email}`,
      },
    });

    logger.info("User deleted", {
      userId,
      deletedBy: currentUserId,
    });

    return { success: true };
  }
}

export const userService = new UserService();
