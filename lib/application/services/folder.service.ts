import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";

export interface CreateFolderInput {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateFolderInput {
  name?: string;
  description?: string;
  parentId?: string | null;
}

export interface FolderTreeNode {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  documentCount: number;
  children: FolderTreeNode[];
}

function buildFolderTree(
  folders: Array<{
    id: string;
    name: string;
    description: string | null;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: { documents: number };
  }>,
  parentId: string | null = null
): FolderTreeNode[] {
  return folders
    .filter((f) => f.parentId === parentId)
    .map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      parentId: f.parentId,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      documentCount: f._count.documents,
      children: buildFolderTree(folders, f.id),
    }));
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

  async getFolderTree() {
    const folders = await prisma.folder.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { documents: true } },
      },
    });
    return buildFolderTree(folders);
  }

  async getFolderById(folderId: string) {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true } },
        _count: { select: { documents: true } },
      },
    });
    if (!folder) throw new Error("Folder not found");
    return folder;
  }

  async getFolderPath(folderId: string): Promise<Array<{ id: string; name: string }>> {
    const path: Array<{ id: string; name: string }> = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder: { id: string; name: string; parentId: string | null } | null =
        await prisma.folder.findUnique({
          where: { id: currentId },
          select: { id: true, name: true, parentId: true },
        });
      if (!folder) break;
      path.unshift({ id: folder.id, name: folder.name });
      currentId = folder.parentId;
    }

    return path;
  }

  async createFolder(data: CreateFolderInput, userId: string) {
    const existing = await prisma.folder.findFirst({
      where: {
        name: { equals: data.name, mode: "insensitive" },
        parentId: data.parentId ?? null,
      },
    });
    if (existing) throw new Error("Ya existe una carpeta con ese nombre en esta ubicación");

    if (data.parentId) {
      const parent = await prisma.folder.findUnique({ where: { id: data.parentId } });
      if (!parent) throw new Error("Carpeta padre no encontrada");
    }

    const folder = await prisma.folder.create({
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId,
      },
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
        where: {
          name: { equals: data.name, mode: "insensitive" },
          parentId: data.parentId !== undefined ? data.parentId : folder.parentId,
          NOT: { id: folderId },
        },
      });
      if (existing) throw new Error("Ya existe una carpeta con ese nombre en esta ubicación");
    }

    if (data.parentId !== undefined && data.parentId !== folder.parentId) {
      if (data.parentId === folderId) {
        throw new Error("Una carpeta no puede ser su propia carpeta padre");
      }
      if (data.parentId) {
        const isDescendant = await this.isDescendant(folderId, data.parentId);
        if (isDescendant) {
          throw new Error("No se puede mover una carpeta dentro de una de sus subcarpetas");
        }
      }
    }

    const updated = await prisma.folder.update({
      where: { id: folderId },
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
      },
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

  private async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
    let currentId: string | null = descendantId;
    const visited = new Set<string>();

    while (currentId) {
      if (currentId === ancestorId) return true;
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const folder: { parentId: string | null } | null = await prisma.folder.findUnique({
        where: { id: currentId },
        select: { parentId: true },
      });
      if (!folder) return false;
      currentId = folder.parentId;
    }

    return false;
  }
}

export const folderService = new FolderService();
