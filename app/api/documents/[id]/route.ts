import { NextRequest } from "next/server";
import { documentService } from "@/lib/application/services/document.service";
import { updateDocumentSchema } from "@/lib/application/validators/document.validators";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.READ}`);

    const document = await documentService.getDocumentById(params.id);

    return successResponse(document);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message === "Document not found") {
        return notFoundResponse(error.message);
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.UPDATE}`);

    const body = await request.json();
    const validatedData = updateDocumentSchema.parse(body);

    const document = await documentService.updateDocument(params.id, validatedData, user.id);

    return successResponse(document, "Document updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message === "Document not found") {
        return notFoundResponse(error.message);
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
    }
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.DELETE}`);

    await documentService.deleteDocument(params.id, user.id);

    return successResponse({ success: true }, "Document deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return unauthorizedResponse();
      }
      if (error.message === "Document not found") {
        return notFoundResponse(error.message);
      }
      if (error.message.includes("Forbidden")) {
        return errorResponse(error.message, 403);
      }
    }
    return handleApiError(error);
  }
}
