import prisma from "@/lib/infrastructure/database/prisma";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  SearchCategoriesInput,
} from "@/lib/application/validators/category.validators";
import { logger } from "@/utils/logger";

export class CategoryService {
  async searchCategories(filters: SearchCategoriesInput) {
    const where: {
      OR?: object[];
    } = {};

    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    const skip = (filters.page - 1) * filters.limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
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
      prisma.category.count({ where }),
    ]);

    return {
      categories,
      pagination: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
      },
    };
  }

  async getCategoryById(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async createCategory(data: CreateCategoryInput, userId: string) {
    const existingCategory = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "create",
        resource: "category",
        resourceId: category.id,
        details: `Created category: ${category.name}`,
      },
    });

    logger.info("Category created", {
      categoryId: category.id,
      userId,
      name: category.name,
    });

    return category;
  }

  async updateCategory(categoryId: string, data: UpdateCategoryInput, userId: string) {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new Error("Category not found");
    }

    if (data.name && data.name !== existingCategory.name) {
      const nameExists = await prisma.category.findUnique({
        where: { name: data.name },
      });

      if (nameExists) {
        throw new Error("Category with this name already exists");
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "update",
        resource: "category",
        resourceId: category.id,
        details: `Updated category: ${category.name}`,
      },
    });

    logger.info("Category updated", {
      categoryId: category.id,
      userId,
    });

    return category;
  }

  async deleteCategory(categoryId: string, userId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (category._count.documents > 0) {
      throw new Error("Cannot delete category with associated documents");
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "delete",
        resource: "category",
        resourceId: categoryId,
        details: `Deleted category: ${category.name}`,
      },
    });

    logger.info("Category deleted", {
      categoryId,
      userId,
    });

    return { success: true };
  }
}

export const categoryService = new CategoryService();
