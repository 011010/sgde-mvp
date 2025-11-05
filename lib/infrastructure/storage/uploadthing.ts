import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getCurrentUser } from "@/lib/infrastructure/auth/rbac";

const f = createUploadthing();

export const uploadRouter = {
  documentUploader: f({
    "application/pdf": { maxFileSize: "50MB", maxFileCount: 10 },
    "application/msword": { maxFileSize: "50MB", maxFileCount: 10 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "50MB",
      maxFileCount: 10,
    },
    "application/vnd.ms-excel": { maxFileSize: "50MB", maxFileCount: 10 },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "50MB",
      maxFileCount: 10,
    },
    "application/vnd.ms-powerpoint": { maxFileSize: "50MB", maxFileCount: 10 },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
      maxFileSize: "50MB",
      maxFileCount: 10,
    },
    "text/plain": { maxFileSize: "50MB", maxFileCount: 10 },
    "text/csv": { maxFileSize: "50MB", maxFileCount: 10 },
    "image/jpeg": { maxFileSize: "10MB", maxFileCount: 10 },
    "image/png": { maxFileSize: "10MB", maxFileCount: 10 },
    "image/gif": { maxFileSize: "10MB", maxFileCount: 10 },
    "image/webp": { maxFileSize: "10MB", maxFileCount: 10 },
    "application/zip": { maxFileSize: "100MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
