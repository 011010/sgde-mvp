export const RESOURCES = {
  DOCUMENT: "document",
  USER: "user",
  ROLE: "role",
  PERMISSION: "permission",
  CATEGORY: "category",
  TAG: "tag",
  AUDIT_LOG: "audit_log",
  CLOUD_INTEGRATION: "cloud_integration",
} as const;

export const ACTIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  MANAGE: "manage",
  SHARE: "share",
  DOWNLOAD: "download",
} as const;

export const DEFAULT_ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const ROLE_DESCRIPTIONS = {
  [DEFAULT_ROLES.SUPER_ADMIN]: "Full system access with all permissions",
  [DEFAULT_ROLES.ADMIN]: "Administrative access to manage users and documents",
  [DEFAULT_ROLES.COORDINATOR]: "Can manage documents and categories for their department",
  [DEFAULT_ROLES.TEACHER]: "Can upload, view, and manage their own documents",
  [DEFAULT_ROLES.STUDENT]: "Can view shared documents",
} as const;

export const DEFAULT_PERMISSIONS = [
  { resource: RESOURCES.DOCUMENT, action: ACTIONS.CREATE },
  { resource: RESOURCES.DOCUMENT, action: ACTIONS.READ },
  { resource: RESOURCES.DOCUMENT, action: ACTIONS.UPDATE },
  { resource: RESOURCES.DOCUMENT, action: ACTIONS.DELETE },
  { resource: RESOURCES.DOCUMENT, action: ACTIONS.SHARE },
  { resource: RESOURCES.DOCUMENT, action: ACTIONS.DOWNLOAD },
  { resource: RESOURCES.USER, action: ACTIONS.CREATE },
  { resource: RESOURCES.USER, action: ACTIONS.READ },
  { resource: RESOURCES.USER, action: ACTIONS.UPDATE },
  { resource: RESOURCES.USER, action: ACTIONS.DELETE },
  { resource: RESOURCES.ROLE, action: ACTIONS.CREATE },
  { resource: RESOURCES.ROLE, action: ACTIONS.READ },
  { resource: RESOURCES.ROLE, action: ACTIONS.UPDATE },
  { resource: RESOURCES.ROLE, action: ACTIONS.DELETE },
  { resource: RESOURCES.CATEGORY, action: ACTIONS.CREATE },
  { resource: RESOURCES.CATEGORY, action: ACTIONS.READ },
  { resource: RESOURCES.CATEGORY, action: ACTIONS.UPDATE },
  { resource: RESOURCES.CATEGORY, action: ACTIONS.DELETE },
  { resource: RESOURCES.TAG, action: ACTIONS.CREATE },
  { resource: RESOURCES.TAG, action: ACTIONS.READ },
  { resource: RESOURCES.TAG, action: ACTIONS.UPDATE },
  { resource: RESOURCES.TAG, action: ACTIONS.DELETE },
  { resource: RESOURCES.CATEGORY, action: ACTIONS.DELETE },
  { resource: RESOURCES.AUDIT_LOG, action: ACTIONS.READ },
  { resource: RESOURCES.CLOUD_INTEGRATION, action: ACTIONS.CREATE },
  { resource: RESOURCES.CLOUD_INTEGRATION, action: ACTIONS.READ },
  { resource: RESOURCES.CLOUD_INTEGRATION, action: ACTIONS.DELETE },
] as const;

export const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  [DEFAULT_ROLES.SUPER_ADMIN]: DEFAULT_PERMISSIONS.map((p) => `${p.resource}:${p.action}`),
  [DEFAULT_ROLES.ADMIN]: [
    `${RESOURCES.DOCUMENT}:${ACTIONS.CREATE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.READ}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.UPDATE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.DELETE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.SHARE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.DOWNLOAD}`,
    `${RESOURCES.USER}:${ACTIONS.CREATE}`,
    `${RESOURCES.USER}:${ACTIONS.READ}`,
    `${RESOURCES.USER}:${ACTIONS.UPDATE}`,
    `${RESOURCES.CATEGORY}:${ACTIONS.CREATE}`,
    `${RESOURCES.CATEGORY}:${ACTIONS.READ}`,
    `${RESOURCES.CATEGORY}:${ACTIONS.UPDATE}`,
    `${RESOURCES.TAG}:${ACTIONS.CREATE}`,
    `${RESOURCES.TAG}:${ACTIONS.READ}`,
    `${RESOURCES.TAG}:${ACTIONS.UPDATE}`,
    `${RESOURCES.TAG}:${ACTIONS.DELETE}`,
    `${RESOURCES.CATEGORY}:${ACTIONS.DELETE}`,
    `${RESOURCES.AUDIT_LOG}:${ACTIONS.READ}`,
  ],
  [DEFAULT_ROLES.COORDINATOR]: [
    `${RESOURCES.DOCUMENT}:${ACTIONS.CREATE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.READ}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.UPDATE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.SHARE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.DOWNLOAD}`,
    `${RESOURCES.CATEGORY}:${ACTIONS.CREATE}`,
    `${RESOURCES.CATEGORY}:${ACTIONS.READ}`,
    `${RESOURCES.TAG}:${ACTIONS.CREATE}`,
    `${RESOURCES.TAG}:${ACTIONS.READ}`,
  ],
  [DEFAULT_ROLES.TEACHER]: [
    `${RESOURCES.DOCUMENT}:${ACTIONS.CREATE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.READ}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.UPDATE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.SHARE}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.DOWNLOAD}`,
    `${RESOURCES.CATEGORY}:${ACTIONS.READ}`,
    `${RESOURCES.TAG}:${ACTIONS.READ}`,
  ],
  [DEFAULT_ROLES.STUDENT]: [
    `${RESOURCES.DOCUMENT}:${ACTIONS.READ}`,
    `${RESOURCES.DOCUMENT}:${ACTIONS.DOWNLOAD}`,
    `${RESOURCES.CATEGORY}:${ACTIONS.READ}`,
    `${RESOURCES.TAG}:${ACTIONS.READ}`,
  ],
};

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
export type Role = (typeof DEFAULT_ROLES)[keyof typeof DEFAULT_ROLES];
