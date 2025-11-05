import { NextRequest } from "next/server";
import { documentService } from "@/lib/application/services/document.service";
import {
  createDocumentSchema,
  searchDocumentsSchema,
} from "@/lib/application/validators/document.validators";
import {
  successResponse,
  createdResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());

    const filters = searchDocumentsSchema.parse({
      ...searchParams,
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: searchParams.limit ? parseInt(searchParams.limit) : 20,
    });

    const result = await documentService.searchDocuments(filters);

    return successResponse(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.CREATE}`);

    const body = await request.json();
    const validatedData = createDocumentSchema.parse(body);

    const document = await documentService.createDocument(validatedData, user.id);

    return createdResponse(document, "Document created successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
    }
    return handleApiError(error);
  }
}
