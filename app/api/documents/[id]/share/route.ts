import { NextRequest } from "next/server";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { documentService } from "@/lib/application/services/document.service";
import { createdResponse, handleApiError } from "@/utils/api-response";
import { shareDocumentSchema } from "@/lib/application/validators/document.validators";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.SHARE}`);

    const { id } = await params;
    const body = await request.json();

    const validatedData = shareDocumentSchema.parse({
      ...body,
      documentId: id,
    });

    const share = await documentService.shareDocument(validatedData, user.id);

    return createdResponse(share, "Document shared successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
