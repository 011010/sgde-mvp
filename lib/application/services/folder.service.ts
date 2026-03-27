import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";

export interface CreateFolderInput {
  name: string;
  description?: string;
}

export interface UpdateFolderInput {
  name?: string;
  description?: string;
}

export class FolderService {
  async getFolders() {
    const folders = await prisma.folder.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { documents: true } },
      },
    });
    return folders;
  }

  async getFolderById(folderId: string) {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        _count: { select: { documents: true } },
      },
    });
    if (!folder) throw new Error("Folder not found");
    return folder;
  }

  async createFolder(data: CreateFolderInput, userId: string) {
    const existing = await prisma.folder.findFirst({
      where: { name: { equals: data.name, mode: "insensitive" } },
    });
    if (existing) throw new Error("Ya existe una carpeta con ese nombre");

    const folder = await prisma.folder.create({
      data: { name: data.name, description: data.description },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "create",
        resource: "folder",
        resourceId: folder.id,
        details: `Created folder: ${folder.name}`,
      },
    });

    logger.info("Folder created", { folderId: folder.id, userId });
    return folder;
  }

  async updateFolder(folderId: string, data: UpdateFolderInput, userId: string) {
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder) throw new Error("Folder not found");

    if (data.name && data.name !== folder.name) {
      const existing = await prisma.folder.findFirst({
        where: { name: { equals: data.name, mode: "insensitive" }, NOT: { id: folderId } },
      });
      if (existing) throw new Error("Ya existe una carpeta con ese nombre");
    }

    const updated = await prisma.folder.update({
      where: { id: folderId },
      data: { name: data.name, description: data.description },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "update",
        resource: "folder",
        resourceId: folderId,
        details: `Updated folder: ${updated.name}`,
      },
    });

    logger.info("Folder updated", { folderId, userId });
    return updated;
  }

  async deleteFolder(folderId: string, userId: string) {
    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder) throw new Error("Folder not found");

    // Move documents to no folder (SetNull is on DB level, just delete the folder)
    await prisma.folder.delete({ where: { id: folderId } });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "delete",
        resource: "folder",
        resourceId: folderId,
        details: `Deleted folder: ${folder.name}`,
      },
    });

    logger.info("Folder deleted", { folderId, userId });
    return { success: true };
  }
}

export const folderService = new FolderService();
