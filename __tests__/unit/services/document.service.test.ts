import { DocumentService } from "@/lib/application/services/document.service";
import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";
import { DOCUMENT_STATUS } from "@/config/upload.config";

jest.mock("@/utils/logger");
jest.mock("@/lib/infrastructure/database/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    document: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    documentShare: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn((ops) => Promise.all(ops)),
  },
}));

describe("DocumentService", () => {
  let documentService: DocumentService;

  beforeEach(() => {
    documentService = new DocumentService();
    jest.clearAllMocks();
  });

  describe("createDocument", () => {
    const validDocumentData = {
      title: "Test Document",
      description: "Test Description",
      fileName: "test.pdf",
      fileSize: 1024,
      mimeType: "application/pdf",
      fileUrl: "https://example.com/test.pdf",
      source: "local" as const,
      categoryIds: ["cat-1", "cat-2"],
      tagIds: ["tag-1"],
    };

    const userId = "user-1";

    it("should create a document with categories and tags", async () => {
      const mockDocument = {
        id: "doc-1",
        ...validDocumentData,
        uploadedBy: userId,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          { category: { id: "cat-1", name: "Category 1" } },
          { category: { id: "cat-2", name: "Category 2" } },
        ],
        tags: [{ tag: { id: "tag-1", name: "Tag 1" } }],
        user: { id: userId, name: "John Doe", email: "john@example.com", image: null },
      };

      (prisma.document.create as jest.Mock).mockResolvedValue(mockDocument);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await documentService.createDocument(validDocumentData, userId);

      expect(result).toEqual(mockDocument);
      expect(prisma.document.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: validDocumentData.title,
          description: validDocumentData.description,
          fileName: validDocumentData.fileName,
          fileSize: validDocumentData.fileSize,
          mimeType: validDocumentData.mimeType,
          fileUrl: validDocumentData.fileUrl,
          source: validDocumentData.source,
          uploadedBy: userId,
          categories: {
            create: [{ categoryId: "cat-1" }, { categoryId: "cat-2" }],
          },
          tags: {
            create: [{ tagId: "tag-1" }],
          },
        }),
        include: expect.any(Object),
      });
      expect(prisma.auditLog.create).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
    });

    it("should create a document without categories and tags", async () => {
      const dataWithoutRelations = {
        title: "Simple Document",
        fileName: "simple.pdf",
        fileSize: 512,
        mimeType: "application/pdf",
        fileUrl: "https://example.com/simple.pdf",
        source: "local" as const,
      };

      const mockDocument = {
        id: "doc-2",
        ...dataWithoutRelations,
        description: null,
        uploadedBy: userId,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [],
        tags: [],
        user: { id: userId, name: "John Doe", email: "john@example.com", image: null },
      };

      (prisma.document.create as jest.Mock).mockResolvedValue(mockDocument);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await documentService.createDocument(dataWithoutRelations, userId);

      expect(result).toEqual(mockDocument);
      expect(prisma.document.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: dataWithoutRelations.title,
          fileName: dataWithoutRelations.fileName,
          fileSize: dataWithoutRelations.fileSize,
          mimeType: dataWithoutRelations.mimeType,
          fileUrl: dataWithoutRelations.fileUrl,
          source: dataWithoutRelations.source,
          uploadedBy: userId,
        }),
        include: expect.any(Object),
      });
    });
  });

  describe("updateDocument", () => {
    const documentId = "doc-1";
    const userId = "user-1";
    const updateData = {
      title: "Updated Title",
      description: "Updated Description",
      categoryIds: ["cat-3"],
      tagIds: ["tag-2"],
    };

    it("should update a document successfully", async () => {
      const existingDocument = { id: documentId, title: "Old Title" };
      const updatedDocument = {
        id: documentId,
        title: updateData.title,
        description: updateData.description,
        fileName: "test.pdf",
        fileSize: 1024,
        mimeType: "application/pdf",
        fileUrl: "https://example.com/test.pdf",
        source: "local",
        uploadedBy: userId,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [{ category: { id: "cat-3", name: "Category 3" } }],
        tags: [{ tag: { id: "tag-2", name: "Tag 2" } }],
        user: { id: userId, name: "John Doe", email: "john@example.com", image: null },
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(existingDocument);
      (prisma.document.update as jest.Mock).mockResolvedValue(updatedDocument);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await documentService.updateDocument(documentId, updateData, userId);

      expect(result).toEqual(updatedDocument);
      expect(prisma.document.findUnique).toHaveBeenCalledWith({
        where: { id: documentId },
      });
      expect(prisma.document.update).toHaveBeenCalled();
    });

    it("should throw error when document not found", async () => {
      (prisma.document.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(documentService.updateDocument(documentId, updateData, userId)).rejects.toThrow(
        "Document not found"
      );
    });
  });

  describe("deleteDocument", () => {
    const documentId = "doc-1";
    const userId = "user-1";

    it("should soft delete a document", async () => {
      const document = { id: documentId, title: "Test Document" };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(document);
      (prisma.document.update as jest.Mock).mockResolvedValue({
        ...document,
        status: DOCUMENT_STATUS.DELETED,
      });
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await documentService.deleteDocument(documentId, userId);

      expect(result).toEqual({ success: true });
      expect(prisma.document.update).toHaveBeenCalledWith({
        where: { id: documentId },
        data: { status: DOCUMENT_STATUS.DELETED },
      });
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it("should throw error when document not found", async () => {
      (prisma.document.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(documentService.deleteDocument(documentId, userId)).rejects.toThrow(
        "Document not found"
      );
    });
  });

  describe("getDocumentById", () => {
    const documentId = "doc-1";

    it("should return document with relations", async () => {
      const mockDocument = {
        id: documentId,
        title: "Test Document",
        categories: [{ category: { id: "cat-1", name: "Category 1" } }],
        tags: [{ tag: { id: "tag-1", name: "Tag 1" } }],
        user: { id: "user-1", name: "John Doe", email: "john@example.com", image: null },
        versions: [],
        shares: [],
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);

      const result = await documentService.getDocumentById(documentId);

      expect(result).toEqual(mockDocument);
      expect(prisma.document.findUnique).toHaveBeenCalledWith({
        where: { id: documentId },
        include: expect.objectContaining({
          categories: expect.any(Object),
          tags: expect.any(Object),
          user: expect.any(Object),
          versions: expect.any(Object),
          shares: true,
        }),
      });
    });

    it("should throw error when document not found", async () => {
      (prisma.document.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(documentService.getDocumentById(documentId)).rejects.toThrow(
        "Document not found"
      );
    });
  });

  describe("searchDocuments", () => {
    it("should search documents with filters", async () => {
      const filters = {
        query: "test",
        categoryId: "cat-1",
        tagId: "tag-1",
        source: "local" as const,
        uploadedBy: "user-1",
        page: 1,
        limit: 10,
        sortBy: "createdAt" as const,
        sortOrder: "desc" as const,
        status: "active" as const,
      };

      const mockDocuments = [
        {
          id: "doc-1",
          title: "Test Document",
          categories: [],
          tags: [],
          user: { id: "user-1", name: "John Doe", email: "john@example.com", image: null },
        },
      ];

      (prisma.document.findMany as jest.Mock).mockResolvedValue(mockDocuments);
      (prisma.document.count as jest.Mock).mockResolvedValue(1);

      const result = await documentService.searchDocuments(filters);

      expect(result.documents).toEqual(mockDocuments);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it("should handle empty search results", async () => {
      const filters = {
        query: "nonexistent",
        page: 1,
        limit: 10,
        sortBy: "createdAt" as const,
        sortOrder: "desc" as const,
      };

      (prisma.document.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.document.count as jest.Mock).mockResolvedValue(0);

      const result = await documentService.searchDocuments(filters);

      expect(result.documents).toEqual([]);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe("shareDocument", () => {
    const shareData = {
      documentId: "doc-1",
      sharedWith: "user2@example.com",
      permission: "view" as const,
      expiresAt: "2025-12-31T00:00:00Z",
    };
    const userId = "user-1";

    it("should share a document", async () => {
      const mockDocument = { id: "doc-1", title: "Test Document" };
      const mockShare = {
        id: "share-1",
        documentId: shareData.documentId,
        sharedWith: shareData.sharedWith,
        permission: shareData.permission,
        expiresAt: new Date(shareData.expiresAt),
        createdAt: new Date(),
      };

      (prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument);
      (prisma.documentShare.create as jest.Mock).mockResolvedValue(mockShare);
      (prisma.auditLog.create as jest.Mock).mockResolvedValue({});

      const result = await documentService.shareDocument(shareData, userId);

      expect(result).toEqual(mockShare);
      expect(prisma.documentShare.create).toHaveBeenCalledWith({
        data: {
          documentId: shareData.documentId,
          sharedWith: shareData.sharedWith,
          permission: shareData.permission,
          expiresAt: expect.any(Date),
        },
      });
    });

    it("should throw error when document not found", async () => {
      (prisma.document.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(documentService.shareDocument(shareData, userId)).rejects.toThrow(
        "Document not found"
      );
    });
  });

  describe("getSharedDocuments", () => {
    it("should return documents shared with user", async () => {
      const userEmail = "user@example.com";
      const mockDocuments = [
        {
          id: "doc-1",
          title: "Shared Document",
          categories: [],
          tags: [],
          user: { id: "user-1", name: "John Doe", email: "john@example.com", image: null },
          shares: [{ sharedWith: userEmail, permission: "read" }],
        },
      ];

      (prisma.document.findMany as jest.Mock).mockResolvedValue(mockDocuments);

      const result = await documentService.getSharedDocuments(userEmail);

      expect(result).toEqual(mockDocuments);
      expect(prisma.document.findMany).toHaveBeenCalledWith({
        where: {
          shares: {
            some: {
              sharedWith: userEmail,
              OR: [{ expiresAt: null }, { expiresAt: { gt: expect.any(Date) } }],
            },
          },
        },
        include: expect.any(Object),
      });
    });
  });
});
