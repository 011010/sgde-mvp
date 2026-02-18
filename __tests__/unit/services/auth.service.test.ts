import { AuthService } from "@/lib/application/services/auth.service";
import prisma from "@/lib/infrastructure/database/prisma";
import { hash, compare } from "bcrypt";
import { logger } from "@/utils/logger";

jest.mock("bcrypt");
jest.mock("@/utils/logger");

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockHash = hash as jest.MockedFunction<typeof hash>;
const mockCompare = compare as jest.MockedFunction<typeof compare>;

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    const validRegisterData = {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123",
    };

    it("should register a new user successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.role.findUnique.mockResolvedValue({
        id: "role-1",
        name: "student",
        description: "Student role",
      });
      mockHash.mockResolvedValue("hashedPassword" as never);
      mockPrisma.user.create.mockResolvedValue({
        id: "user-1",
        name: validRegisterData.name,
        email: validRegisterData.email,
        password: "hashedPassword",
        image: null,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userRoles: [
          {
            role: {
              id: "role-1",
              name: "student",
              description: "Student role",
            },
          },
        ],
      });

      const result = await authService.registerUser(validRegisterData);

      expect(result).not.toHaveProperty("password");
      expect(result.name).toBe(validRegisterData.name);
      expect(result.email).toBe(validRegisterData.email);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: validRegisterData.name,
          email: validRegisterData.email,
          password: "hashedPassword",
        }),
        include: expect.any(Object),
      });
      expect(logger.info).toHaveBeenCalledWith("User registered successfully", expect.any(Object));
    });

    it("should throw error if user already exists", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "existing-user",
        email: validRegisterData.email,
      });

      await expect(authService.registerUser(validRegisterData)).rejects.toThrow(
        "User already exists with this email"
      );
    });

    it("should throw error if default role not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(authService.registerUser(validRegisterData)).rejects.toThrow(
        "Default role not found"
      );
    });
  });

  describe("changePassword", () => {
    const userId = "user-1";
    const validChangeData = {
      currentPassword: "OldPass123",
      newPassword: "NewPass123",
      confirmPassword: "NewPass123",
    };

    it("should change password successfully", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: userId,
        password: "oldHashedPassword",
      });
      mockCompare.mockResolvedValue(true as never);
      mockHash.mockResolvedValue("newHashedPassword" as never);
      mockPrisma.user.update.mockResolvedValue({ id: userId });

      const result = await authService.changePassword(userId, validChangeData);

      expect(result).toEqual({ success: true });
      expect(mockCompare).toHaveBeenCalledWith(
        validChangeData.currentPassword,
        "oldHashedPassword"
      );
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { password: "newHashedPassword" },
      });
      expect(logger.info).toHaveBeenCalledWith("Password changed successfully", { userId });
    });

    it("should throw error if user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.changePassword(userId, validChangeData)).rejects.toThrow(
        "User not found or password not set"
      );
    });

    it("should throw error if current password is incorrect", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: userId,
        password: "oldHashedPassword",
      });
      mockCompare.mockResolvedValue(false as never);

      await expect(authService.changePassword(userId, validChangeData)).rejects.toThrow(
        "Current password is incorrect"
      );
    });
  });

  describe("getUserWithRolesAndPermissions", () => {
    const userId = "user-1";

    it("should return user with roles and permissions", async () => {
      const mockUser = {
        id: userId,
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
        image: null,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userRoles: [
          {
            role: {
              id: "role-1",
              name: "admin",
              description: "Admin role",
              rolePermissions: [
                {
                  permission: {
                    id: "perm-1",
                    name: "document:create",
                    resource: "document",
                    action: "create",
                  },
                },
                {
                  permission: {
                    id: "perm-2",
                    name: "user:read",
                    resource: "user",
                    action: "read",
                  },
                },
              ],
            },
          },
        ],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await authService.getUserWithRolesAndPermissions(userId);

      expect(result).not.toHaveProperty("password");
      expect(result.roles).toHaveLength(1);
      expect(result.roles[0]).toEqual({
        id: "role-1",
        name: "admin",
        description: "Admin role",
      });
      expect(result.permissions).toHaveLength(2);
      expect(result.permissions[0]).toEqual({
        id: "perm-1",
        name: "document:create",
        resource: "document",
        action: "create",
      });
    });

    it("should throw error if user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.getUserWithRolesAndPermissions(userId)).rejects.toThrow(
        "User not found"
      );
    });

    it("should deduplicate permissions from multiple roles", async () => {
      const mockUser = {
        id: userId,
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
        image: null,
        emailVerified: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userRoles: [
          {
            role: {
              id: "role-1",
              name: "admin",
              description: "Admin role",
              rolePermissions: [
                {
                  permission: {
                    id: "perm-1",
                    name: "document:create",
                    resource: "document",
                    action: "create",
                  },
                },
              ],
            },
          },
          {
            role: {
              id: "role-2",
              name: "teacher",
              description: "Teacher role",
              rolePermissions: [
                {
                  permission: {
                    id: "perm-1",
                    name: "document:create",
                    resource: "document",
                    action: "create",
                  },
                },
                {
                  permission: {
                    id: "perm-3",
                    name: "document:read",
                    resource: "document",
                    action: "read",
                  },
                },
              ],
            },
          },
        ],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await authService.getUserWithRolesAndPermissions(userId);

      expect(result.permissions).toHaveLength(2);
      expect(result.permissions.map((p: { id: string }) => p.id)).toEqual(["perm-1", "perm-3"]);
    });
  });
});
