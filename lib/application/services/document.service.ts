import prisma from "@/lib/infrastructure/database/prisma";
import {
  CreateDocumentInput,
  UpdateDocumentInput,
  SearchDocumentsInput,
  ShareDocumentInput,
} from "@/lib/application/validators/document.validators";
import { logger } from "@/utils/logger";
import { DOCUMENT_STATUS } from "@/config/upload.config";

export class DocumentService {
  async createDocument(data: CreateDocumentInput, userId: string) {
    const document = await prisma.document.create({
      data: {
        title: data.title,
        description: data.description,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        fileUrl: data.fileUrl,
        source: data.source,
        uploadedBy: userId,
        categories: data.categoryIds
          ? {
              create: data.categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
        tags: data.tagIds
          ? {
              create: data.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "create",
        resource: "document",
        resourceId: document.id,
        details: `Created document: ${document.title}`,
      },
    });

    logger.info("Document created", {
      documentId: document.id,
      userId,
      title: document.title,
    });

    return document;
  }

  async updateDocument(documentId: string, data: UpdateDocumentInput, userId: string) {
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDocument) {
      throw new Error("Document not found");
    }

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        categories: data.categoryIds
          ? {
              deleteMany: {},
              create: data.categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
        tags: data.tagIds
          ? {
              deleteMany: {},
              create: data.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "update",
        resource: "document",
        resourceId: document.id,
        details: `Updated document: ${document.title}`,
      },
    });

    logger.info("Document updated", {
      documentId: document.id,
      userId,
    });

    return document;
  }

  async deleteDocument(documentId: string, userId: string) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: DOCUMENT_STATUS.DELETED,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "delete",
        resource: "document",
        resourceId: documentId,
        details: `Deleted document: ${document.title}`,
      },
    });

    logger.info("Document deleted", {
      documentId,
      userId,
    });

    return { success: true };
  }

  async getDocumentById(documentId: string) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        versions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
        shares: true,
      },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    return document;
  }

  async searchDocuments(filters: SearchDocumentsInput) {
    const where: {
      status: string;
      OR?: object[];
      categories?: object;
      tags?: object;
      source?: string;
      uploadedBy?: string;
    } = {
      status: filters.status || DOCUMENT_STATUS.ACTIVE,
    };

    if (filters.query) {
      where.OR = [
        { title: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
        { fileName: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    if (filters.categoryId) {
      where.categories = {
        some: {
          categoryId: filters.categoryId,
        },
      };
    }

    if (filters.tagId) {
      where.tags = {
        some: {
          tagId: filters.tagId,
        },
      };
    }

    if (filters.source) {
      where.source = filters.source;
    }

    if (filters.uploadedBy) {
      where.uploadedBy = filters.uploadedBy;
    }

    const skip = (filters.page - 1) * filters.limit;

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: {
          [filters.sortBy]: filters.sortOrder,
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
      prisma.document.count({ where }),
    ]);

    return {
      documents,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async shareDocument(data: ShareDocumentInput, userId: string) {
    const document = await prisma.document.findUnique({
      where: { id: data.documentId },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    const share = await prisma.documentShare.create({
      data: {
        documentId: data.documentId,
        sharedWith: data.sharedWith,
        permission: data.permission,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "share",
        resource: "document",
        resourceId: document.id,
        details: `Shared document with ${data.sharedWith}`,
      },
    });

    logger.info("Document shared", {
      documentId: document.id,
      sharedWith: data.sharedWith,
      userId,
    });

    return share;
  }

  async getSharedDocuments(userEmail: string) {
    const documents = await prisma.document.findMany({
      where: {
        shares: {
          some: {
            sharedWith: userEmail,
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        shares: {
          where: {
            sharedWith: userEmail,
          },
        },
      },
    });

    return documents;
  }
}

export const documentService = new DocumentService();
