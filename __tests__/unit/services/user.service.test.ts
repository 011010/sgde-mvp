import { UserService } from "@/lib/application/services/user.service";
import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";

jest.mock("@/utils/logger");

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe("searchUsers", () => {
    it("should search users with query filter", async () => {
      const filters = {
        query: "john",
        page: 1,
        limit: 10,
        sortBy: "name" as const,
        sortOrder: "asc" as const,
      };

      const mockUsers = [
        {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          userRoles: [{ role: { id: "role-1", name: "admin", description: "Admin role" } }],
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.user.count as jest.Mock).mockResolvedValue(1);

      const result = await userService.searchUsers(filters);

      expect(result.users).toEqual(mockUsers);
      expect(result.pagination.total).toBe(1);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { name: { contains: "john", mode: "insensitive" } },
              { email: { contains: "john", mode: "insensitive" } },
            ],
          }),
        })
      );
    });

    it("should filter users by role", async () => {
      const filters = {
        roleId: "role-1",
        page: 1,
        limit: 10,
        sortBy: "createdAt" as const,
        sortOrder: "desc" as const,
      };

      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      await userService.searchUsers(filters);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userRoles: {
              some: { roleId: "role-1" },
            },
          }),
        })
      );
    });

    it("should handle pagination correctly", async () => {
      const filters = {
        page: 2,
        limit: 5,
        sortBy: "createdAt" as const,
        sortOrder: "desc" as const,
      };

      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(12);

      const result = await userService.searchUsers(filters);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        })
      );
      expect(result.pagination.totalPages).toBe(3);
    });
  });

  describe("getUserById", () => {
    it("should return user with roles", async () => {
      const userId = "user-1";
      const mockUser = {
        id: userId,
        name: "John Doe",
        email: "john@example.com",
        userRoles: [{ role: { id: "role-1", name: "admin", description: "Admin role" } }],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
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
    });

    it("should throw error when user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById("nonexistent")).rejects.toThrow("User not found");
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const userId = "user-1";
      const currentUserId = "admin-1";
      const updateData = {
        name: "John Updated",
        email: "john.updated@example.com",
        image: "https://example.com/image.png",
      };

      const existingUser = { id: userId, name: "John Doe", email: "john@example.com" };
      const updatedUser = {
        ...existingUser,
        ...updateData,
        userRoles: [],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await userService.updateUser(userId, updateData, currentUserId);

      expect(result.name).toBe(updateData.name);
      expect(result.email).toBe(updateData.email);
      expect(prisma.auditLog.create).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
    });

    it("should throw error when user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.updateUser("nonexistent", { name: "Test" }, "admin-1")
      ).rejects.toThrow("User not found");
    });
  });

  describe("updateUserRoles", () => {
    it("should update user roles", async () => {
      const userId = "user-1";
      const currentUserId = "admin-1";
      const roleData = { roleIds: ["role-1", "role-2"] };

      const existingUser = { id: userId, name: "John Doe", email: "john@example.com" };
      const updatedUser = {
        ...existingUser,
        userRoles: [
          { role: { id: "role-1", name: "admin", description: "Admin" } },
          { role: { id: "role-2", name: "teacher", description: "Teacher" } },
        ],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (prisma.$transaction as jest.Mock).mockResolvedValue([]);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(updatedUser);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await userService.updateUserRoles(userId, roleData, currentUserId);

      expect(result?.userRoles).toHaveLength(2);
      expect(prisma.userRole.deleteMany).toHaveBeenCalledWith({ where: { userId } });
      expect(prisma.userRole.create).toHaveBeenCalledTimes(2);
    });

    it("should throw error when user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.updateUserRoles("nonexistent", { roleIds: ["role-1"] }, "admin-1")
      ).rejects.toThrow("User not found");
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      const userId = "user-1";
      const currentUserId = "admin-1";

      const user = { id: userId, name: "John Doe", email: "john@example.com" };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prisma.user.delete as jest.Mock).mockResolvedValue(user);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await userService.deleteUser(userId, currentUserId);

      expect(result).toEqual({ success: true });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    });

    it("should throw error when user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.deleteUser("nonexistent", "admin-1")).rejects.toThrow(
        "User not found"
      );
    });

    it("should throw error when trying to delete own account", async () => {
      const userId = "user-1";

      const user = { id: userId, name: "John Doe", email: "john@example.com" };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

      await expect(userService.deleteUser(userId, userId)).rejects.toThrow(
        "Cannot delete your own account"
      );
    });
  });
});
