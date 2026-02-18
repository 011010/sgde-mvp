import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "@/lib/application/validators/auth.validators";

describe("Auth Validators", () => {
  describe("registerSchema", () => {
    it("should validate valid registration data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Password123",
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject name less than 2 characters", () => {
      const invalidData = {
        name: "J",
        email: "john@example.com",
        password: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name must be at least 2 characters");
      }
    });

    it("should reject invalid email", () => {
      const invalidData = {
        name: "John Doe",
        email: "invalid-email",
        password: "Password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email address");
      }
    });

    it("should reject password less than 8 characters", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Pass1",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password must be at least 8 characters");
      }
    });

    it("should reject password without uppercase letter", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must contain at least one uppercase letter"
        );
      }
    });

    it("should reject password without lowercase letter", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "PASSWORD123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Password must contain at least one lowercase letter"
        );
      }
    });

    it("should reject password without number", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "PasswordABC",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password must contain at least one number");
      }
    });
  });

  describe("loginSchema", () => {
    it("should validate valid login data", () => {
      const validData = {
        email: "john@example.com",
        password: "Password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "Password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "john@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password is required");
      }
    });
  });

  describe("changePasswordSchema", () => {
    it("should validate valid password change data", () => {
      const validData = {
        currentPassword: "OldPass123",
        newPassword: "NewPass123",
        confirmPassword: "NewPass123",
      };

      const result = changePasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject when passwords do not match", () => {
      const invalidData = {
        currentPassword: "OldPass123",
        newPassword: "NewPass123",
        confirmPassword: "DifferentPass123",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords do not match");
      }
    });

    it("should reject new password without uppercase", () => {
      const invalidData = {
        currentPassword: "OldPass123",
        newPassword: "newpass123",
        confirmPassword: "newpass123",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject new password without lowercase", () => {
      const invalidData = {
        currentPassword: "OldPass123",
        newPassword: "NEWPASS123",
        confirmPassword: "NEWPASS123",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject new password without number", () => {
      const invalidData = {
        currentPassword: "OldPass123",
        newPassword: "NewPassword",
        confirmPassword: "NewPassword",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject new password less than 8 characters", () => {
      const invalidData = {
        currentPassword: "OldPass123",
        newPassword: "NewP1",
        confirmPassword: "NewP1",
      };

      const result = changePasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
