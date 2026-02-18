import {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
} from "@/lib/infrastructure/auth/rbac";

// Mock the auth module to avoid import issues
jest.mock("@/lib/infrastructure/auth/auth.config", () => ({
  auth: jest.fn(),
}));

describe("RBAC Module", () => {
  describe("checkPermission", () => {
    it("should return true when user has the permission", () => {
      const userPermissions = ["document:create", "document:read", "user:read"];
      expect(checkPermission(userPermissions, "document:create")).toBe(true);
    });

    it("should return false when user does not have the permission", () => {
      const userPermissions = ["document:read", "user:read"];
      expect(checkPermission(userPermissions, "document:create")).toBe(false);
    });

    it("should return false for empty permissions array", () => {
      expect(checkPermission([], "document:create")).toBe(false);
    });
  });

  describe("checkAnyPermission", () => {
    it("should return true when user has at least one required permission", () => {
      const userPermissions = ["document:create", "user:read"];
      const requiredPermissions = ["document:delete", "document:create"];
      expect(checkAnyPermission(userPermissions, requiredPermissions)).toBe(true);
    });

    it("should return false when user has none of the required permissions", () => {
      const userPermissions = ["document:read", "user:read"];
      const requiredPermissions = ["document:delete", "document:create"];
      expect(checkAnyPermission(userPermissions, requiredPermissions)).toBe(false);
    });

    it("should return false for empty user permissions", () => {
      const requiredPermissions = ["document:create"];
      expect(checkAnyPermission([], requiredPermissions)).toBe(false);
    });
  });

  describe("checkAllPermissions", () => {
    it("should return true when user has all required permissions", () => {
      const userPermissions = ["document:create", "document:read", "document:update"];
      const requiredPermissions = ["document:create", "document:read"];
      expect(checkAllPermissions(userPermissions, requiredPermissions)).toBe(true);
    });

    it("should return false when user is missing one required permission", () => {
      const userPermissions = ["document:read", "document:update"];
      const requiredPermissions = ["document:create", "document:read"];
      expect(checkAllPermissions(userPermissions, requiredPermissions)).toBe(false);
    });

    it("should return true for empty required permissions", () => {
      const userPermissions = ["document:create"];
      expect(checkAllPermissions(userPermissions, [])).toBe(true);
    });

    it("should return false for empty user permissions with required permissions", () => {
      const requiredPermissions = ["document:create"];
      expect(checkAllPermissions([], requiredPermissions)).toBe(false);
    });
  });
});
