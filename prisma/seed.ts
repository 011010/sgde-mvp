/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import {
  DEFAULT_ROLES,
  ROLE_DESCRIPTIONS,
  DEFAULT_PERMISSIONS,
  ROLE_PERMISSIONS_MAP,
} from "../config/permissions.config";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  console.log("Creating permissions...");
  const permissionsMap = new Map<string, string>();

  for (const permission of DEFAULT_PERMISSIONS) {
    const key = `${permission.resource}:${permission.action}`;
    const existing = await prisma.permission.findUnique({
      where: {
        resource_action: {
          resource: permission.resource,
          action: permission.action,
        },
      },
    });

    if (existing) {
      permissionsMap.set(key, existing.id);
      console.log(`Permission already exists: ${key}`);
    } else {
      const created = await prisma.permission.create({
        data: {
          name: key,
          resource: permission.resource,
          action: permission.action,
          description: `Permission to ${permission.action} ${permission.resource}`,
        },
      });
      permissionsMap.set(key, created.id);
      console.log(`Created permission: ${key}`);
    }
  }

  console.log("Creating roles...");
  const rolesMap = new Map<string, string>();

  for (const [key, roleName] of Object.entries(DEFAULT_ROLES)) {
    const existing = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (existing) {
      rolesMap.set(roleName, existing.id);
      console.log(`Role already exists: ${roleName}`);
    } else {
      const created = await prisma.role.create({
        data: {
          name: roleName,
          description: ROLE_DESCRIPTIONS[roleName],
        },
      });
      rolesMap.set(roleName, created.id);
      console.log(`Created role: ${roleName}`);
    }
  }

  console.log("Assigning permissions to roles...");
  for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS_MAP)) {
    const roleId = rolesMap.get(roleName);
    if (!roleId) {
      console.warn(`Role not found: ${roleName}`);
      continue;
    }

    for (const permissionKey of permissions) {
      const permissionId = permissionsMap.get(permissionKey);
      if (!permissionId) {
        console.warn(`Permission not found: ${permissionKey}`);
        continue;
      }

      const existing = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId,
            permissionId,
          },
        },
      });

      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId,
          },
        });
        console.log(`Assigned ${permissionKey} to ${roleName}`);
      }
    }
  }

  console.log("Creating default super admin user...");
  const adminEmail = "admin@sgde.local";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash("Admin123!", 10);

    const adminUser = await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
      },
    });

    const superAdminRoleId = rolesMap.get(DEFAULT_ROLES.SUPER_ADMIN);
    if (superAdminRoleId) {
      await prisma.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: superAdminRoleId,
        },
      });
      console.log("Created super admin user:");
      console.log(`  Email: ${adminEmail}`);
      console.log(`  Password: Admin123!`);
      console.log("  IMPORTANT: Change this password after first login!");
    }
  } else {
    console.log("Super admin user already exists");
  }

  console.log("Creating sample categories...");
  const categories = [
    { name: "Academic", description: "Academic documents and materials", color: "#3b82f6" },
    { name: "Administrative", description: "Administrative documents", color: "#8b5cf6" },
    { name: "Financial", description: "Financial documents and records", color: "#10b981" },
    { name: "Human Resources", description: "HR related documents", color: "#f59e0b" },
    { name: "Legal", description: "Legal documents and contracts", color: "#ef4444" },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { name: category.name },
    });

    if (!existing) {
      await prisma.category.create({ data: category });
      console.log(`Created category: ${category.name}`);
    }
  }

  console.log("Creating sample tags...");
  const tags = [
    "urgent",
    "confidential",
    "public",
    "archived",
    "draft",
    "final",
    "semester-1",
    "semester-2",
    "year-2024",
  ];

  for (const tagName of tags) {
    const existing = await prisma.tag.findUnique({
      where: { name: tagName },
    });

    if (!existing) {
      await prisma.tag.create({
        data: { name: tagName },
      });
      console.log(`Created tag: ${tagName}`);
    }
  }

  console.log("Database seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
