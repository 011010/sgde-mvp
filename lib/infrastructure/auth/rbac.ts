import { auth } from "@/lib/infrastructure/auth/auth.config";
import { Session } from "next-auth";

export async function getCurrentUser(): Promise<Session["user"] | null> {
  const session = await auth();
  return session?.user || null;
}

export async function requireAuth(): Promise<Session["user"]> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return user.roles.includes(role);
}

export async function hasAnyRole(roles: string[]): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return roles.some((role) => user.roles.includes(role));
}

export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return user.permissions.includes(permission);
}

export async function requirePermission(permission: string): Promise<void> {
  const hasAccess = await hasPermission(permission);

  if (!hasAccess) {
    throw new Error("Forbidden: Insufficient permissions");
  }
}

export async function requireRole(role: string): Promise<void> {
  const hasAccess = await hasRole(role);

  if (!hasAccess) {
    throw new Error("Forbidden: Insufficient role");
  }
}

export async function requireAnyRole(roles: string[]): Promise<void> {
  const hasAccess = await hasAnyRole(roles);

  if (!hasAccess) {
    throw new Error("Forbidden: Insufficient role");
  }
}

export function checkPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission);
}

export function checkAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
}

export function checkAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every((permission) => userPermissions.includes(permission));
}
