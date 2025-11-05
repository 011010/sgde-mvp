export const ALLOWED_FILE_TYPES = {
  DOCUMENTS: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ],
  IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  ARCHIVES: ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"],
} as const;

export const ALL_ALLOWED_TYPES = [
  ...ALLOWED_FILE_TYPES.DOCUMENTS,
  ...ALLOWED_FILE_TYPES.IMAGES,
  ...ALLOWED_FILE_TYPES.ARCHIVES,
];

export const FILE_EXTENSION_MAP: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "text/plain": "txt",
  "text/csv": "csv",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "application/zip": "zip",
  "application/x-rar-compressed": "rar",
  "application/x-7z-compressed": "7z",
};

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024,
  MAX_FILES_PER_UPLOAD: 10,
  MAX_TOTAL_SIZE_PER_UPLOAD: 100 * 1024 * 1024,
} as const;

export const DOCUMENT_STATUS = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  DELETED: "deleted",
} as const;

export const DOCUMENT_SOURCE = {
  LOCAL: "local",
  GOOGLE_DRIVE: "google_drive",
  ONE_DRIVE: "one_drive",
  DROPBOX: "dropbox",
} as const;

export const SHARE_PERMISSIONS = {
  VIEW: "view",
  EDIT: "edit",
  ADMIN: "admin",
} as const;

export type DocumentStatus = (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];
export type DocumentSource = (typeof DOCUMENT_SOURCE)[keyof typeof DOCUMENT_SOURCE];
export type SharePermission = (typeof SHARE_PERMISSIONS)[keyof typeof SHARE_PERMISSIONS];
