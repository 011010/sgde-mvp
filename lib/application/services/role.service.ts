import prisma from "@/lib/infrastructure/database/prisma";
import {
  CreateRoleInput,
  UpdateRoleInput,
  SearchRolesInput,
  UpdateRolePermissionsInput,
} from "@/lib/application/validators/role.validators";
import { logger } from "@/utils/logger";
import { DEFAULT_ROLES } from "@/config/permissions.config";

export class RoleService {
  async searchRoles(filters: SearchRolesInput) {
    const where: {
      OR?: object[];
    } = {};

    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    const skip = (filters.page - 1) * filters.limit;

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: {
          [filters.sortBy]: filters.sortOrder,
        },
        include: {
          rolePermissions: {
            include: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  resource: true,
                  action: true,
                },
              },
            },
          },
          _count: {
            select: {
              userRoles: true,
            },
          },
        },
      }),
      prisma.role.count({ where }),
    ]);

    return {
      roles,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getAllPermissions() {
    const permissions = await prisma.permission.findMany({
      orderBy: [{ resource: "asc" }, { action: "asc" }],
    });

    return permissions;
  }

  async getRoleById(roleId: string) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: {
              select: {
                id: true,
                name: true,
                resource: true,
                action: true,
              },
            },
          },
        },
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    });

    if (!role) {
      throw new Error("Role not found");
    }

    return role;
  }

  async createRole(data: CreateRoleInput, userId: string) {
    const existingRole = await prisma.role.findUnique({
      where: { name: data.name },
    });

    if (existingRole) {
      throw new Error("Role with this name already exists");
    }

    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        rolePermissions: data.permissionIds
          ? {
              create: data.permissionIds.map((permissionId) => ({
                permissionId,
              })),
            }
          : undefined,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "create",
        resource: "role",
        resourceId: role.id,
        details: `Created role: ${role.name}`,
      },
    });

    logger.info("Role created", {
      roleId: role.id,
      userId,
      name: role.name,
    });

    return role;
  }

  async updateRole(roleId: string, data: UpdateRoleInput, userId: string) {
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      throw new Error("Role not found");
    }

    if (
      Object.values(DEFAULT_ROLES).includes(
        existingRole.name as (typeof DEFAULT_ROLES)[keyof typeof DEFAULT_ROLES]
      )
    ) {
      throw new Error("Cannot modify system default roles");
    }

    if (data.name && data.name !== existingRole.name) {
      const nameExists = await prisma.role.findUnique({
        where: { name: data.name },
      });

      if (nameExists) {
        throw new Error("Role with this name already exists");
      }
    }

    const role = await prisma.role.update({
      where: { id: roleId },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "update",
        resource: "role",
        resourceId: role.id,
        details: `Updated role: ${role.name}`,
      },
    });

    logger.info("Role updated", {
      roleId: role.id,
      userId,
    });

    return role;
  }

  async updateRolePermissions(roleId: string, data: UpdateRolePermissionsInput, userId: string) {
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      throw new Error("Role not found");
    }

    if (
      Object.values(DEFAULT_ROLES).includes(
        existingRole.name as (typeof DEFAULT_ROLES)[keyof typeof DEFAULT_ROLES]
      )
    ) {
      throw new Error("Cannot modify system default roles");
    }

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({
        where: { roleId },
      }),
      ...data.permissionIds.map((permissionId: string) =>
        prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
        })
      ),
    ]);

    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "update",
        resource: "role",
        resourceId: roleId,
        details: `Updated permissions for role: ${role?.name}`,
      },
    });

    logger.info("Role permissions updated", {
      roleId,
      userId,
      permissionCount: data.permissionIds.length,
    });

    return role;
  }

  async deleteRole(roleId: string, userId: string) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
    });

    if (!role) {
      throw new Error("Role not found");
    }

    if (
      Object.values(DEFAULT_ROLES).includes(
        role.name as (typeof DEFAULT_ROLES)[keyof typeof DEFAULT_ROLES]
      )
    ) {
      throw new Error("Cannot delete system default roles");
    }

    if (role._count.userRoles > 0) {
      throw new Error("Cannot delete role with assigned users");
    }

    await prisma.role.delete({
      where: { id: roleId },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "delete",
        resource: "role",
        resourceId: roleId,
        details: `Deleted role: ${role.name}`,
      },
    });

    logger.info("Role deleted", {
      roleId,
      userId,
    });

    return { success: true };
  }
}

export const roleService = new RoleService();
