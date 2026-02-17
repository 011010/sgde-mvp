import prisma from "@/lib/infrastructure/database/prisma";
import {
  CreateTagInput,
  UpdateTagInput,
  SearchTagsInput,
} from "@/lib/application/validators/category.validators";
import { logger } from "@/utils/logger";

export class TagService {
  async searchTags(filters: SearchTagsInput) {
    const where: {
      OR?: object[];
    } = {};

    if (filters.query) {
      where.OR = [{ name: { contains: filters.query, mode: "insensitive" } }];
    }

    const skip = (filters.page - 1) * filters.limit;

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: {
          [filters.sortBy]: filters.sortOrder,
        },
        include: {
          _count: {
            select: {
              documents: true,
            },
          },
        },
      }),
      prisma.tag.count({ where }),
    ]);

    return {
      tags,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getTagById(tagId: string) {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    return tag;
  }

  async createTag(data: CreateTagInput, userId: string) {
    const existingTag = await prisma.tag.findUnique({
      where: { name: data.name },
    });

    if (existingTag) {
      throw new Error("Tag with this name already exists");
    }

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "create",
        resource: "tag",
        resourceId: tag.id,
        details: `Created tag: ${tag.name}`,
      },
    });

    logger.info("Tag created", {
      tagId: tag.id,
      userId,
      name: tag.name,
    });

    return tag;
  }

  async updateTag(tagId: string, data: UpdateTagInput, userId: string) {
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!existingTag) {
      throw new Error("Tag not found");
    }

    if (data.name && data.name !== existingTag.name) {
      const nameExists = await prisma.tag.findUnique({
        where: { name: data.name },
      });

      if (nameExists) {
        throw new Error("Tag with this name already exists");
      }
    }

    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: {
        name: data.name,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "update",
        resource: "tag",
        resourceId: tag.id,
        details: `Updated tag: ${tag.name}`,
      },
    });

    logger.info("Tag updated", {
      tagId: tag.id,
      userId,
    });

    return tag;
  }

  async deleteTag(tagId: string, userId: string) {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    if (tag._count.documents > 0) {
      throw new Error("Cannot delete tag with associated documents");
    }

    await prisma.tag.delete({
      where: { id: tagId },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "delete",
        resource: "tag",
        resourceId: tagId,
        details: `Deleted tag: ${tag.name}`,
      },
    });

    logger.info("Tag deleted", {
      tagId,
      userId,
    });

    return { success: true };
  }
}

export const tagService = new TagService();
