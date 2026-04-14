import { NextRequest } from "next/server";
import { folderDownloadService } from "@/lib/application/services/folder-download.service";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { errorResponse, unauthorizedResponse, handleApiError } from "@/utils/api-response";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";
import { prisma } from "@/lib/infrastructure/database/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.DOWNLOAD}`);

    const { id } = await params;

    const folder = await prisma.folder.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!folder) {
      return errorResponse("Folder not found", 404);
    }

    const { folderName, files } = await folderDownloadService.collectFolderFiles(id);

    if (files.length === 0) {
      return errorResponse("La carpeta no contiene archivos", 400);
    }

    const zipBuffer = await folderDownloadService.createZipBuffer(folderName, files);
    const sanitized = folderName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]/g, "").trim() || "carpeta";

    return new Response(zipBuffer as unknown as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${sanitized}.zip"`,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message.startsWith("Forbidden")) return errorResponse(error.message, 403);
    }
    return handleApiError(error);
  }
}
