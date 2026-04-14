# Folder Download Feature - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the ability to download an entire folder (including all subfolders) as a ZIP file from the folder context menu.

**Architecture:** Server-side ZIP streaming using `archiver` library. New API endpoint `GET /api/folders/[id]/download` that recursively collects documents, fetches file content from UploadThing URLs, and streams a ZIP response. Frontend adds a "Descargar carpeta" option to the folder tree context menu.

**Tech Stack:** archiver (Node.js ZIP), Next.js API Routes, TanStack Query mutation, Prisma

---

### Task 1: Install archiver dependency

**Files:**

- Modify: `package.json`

**Step 1: Install archiver and its types**

Run: `npm install archiver && npm install -D @types/archiver`

**Step 2: Verify installation**

Run: `npm ls archiver`
Expected: archiver listed with version

---

### Task 2: Create folder download service

**Files:**

- Create: `lib/application/services/folder-download.service.ts`
- Reference: `lib/application/services/folder.service.ts`, `lib/application/services/document.service.ts`

**Step 1: Write the folder download service**

Create `lib/application/services/folder-download.service.ts` with:

```typescript
import prisma from "@/lib/infrastructure/database/prisma";
import { logger } from "@/utils/logger";
import archiver from "archiver";

export interface FolderFileInfo {
  id: string;
  fileName: string;
  fileUrl: string;
  folderPath: string;
}

export class FolderDownloadService {
  async collectFolderFiles(folderId: string): Promise<{
    folderName: string;
    files: FolderFileInfo[];
  }> {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      select: { id: true, name: true },
    });

    if (!folder) throw new Error("Folder not found");

    const files: FolderFileInfo[] = [];
    await this.collectFilesRecursive(folderId, folder.name, files);

    return { folderName: folder.name, files };
  }

  private async collectFilesRecursive(
    folderId: string,
    folderPath: string,
    files: FolderFileInfo[]
  ): Promise<void> {
    const documents = await prisma.document.findMany({
      where: { folderId, status: "active" },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
      },
    });

    for (const doc of documents) {
      files.push({
        id: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        folderPath,
      });
    }

    const subfolders = await prisma.folder.findMany({
      where: { parentId: folderId },
      select: { id: true, name: true },
    });

    for (const subfolder of subfolders) {
      await this.collectFilesRecursive(subfolder.id, `${folderPath}/${subfolder.name}`, files);
    }
  }

  createZipStream(folderName: string, files: FolderFileInfo[]): NodeJS.ReadableStream {
    const archive = archiver("zip", { zlib: { level: 6 } });

    for (const file of files) {
      archive.append(file.fileUrl, {
        name: file.fileName,
        prefix: file.folderPath,
      });
    }

    archive.finalize();
    return archive;
  }
}

export const folderDownloadService = new FolderDownloadService();
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`

---

### Task 3: Create API endpoint for folder download

**Files:**

- Create: `app/api/folders/[id]/download/route.ts`
- Reference: `app/api/folders/[id]/route.ts`

**Step 1: Write the download endpoint**

Create `app/api/folders/[id]/download/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { folderDownloadService } from "@/lib/application/services/folder-download.service";
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { errorResponse, unauthorizedResponse, handleApiError } from "@/utils/api-response";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.DOWNLOAD}`);

    const { id } = await params;
    const { folderName, files } = await folderDownloadService.collectFolderFiles(id);

    if (files.length === 0) {
      return errorResponse("La carpeta no contiene archivos", 400);
    }

    const zipStream = folderDownloadService.createZipStream(folderName, files);

    const sanitized = folderName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]/g, "").trim() || "carpeta";

    return new Response(zipStream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${sanitized}.zip"`,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message === "Folder not found") return errorResponse(error.message, 404);
      if (error.message.startsWith("Forbidden")) return errorResponse(error.message, 403);
    }
    return handleApiError(error);
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`

---

### Task 4: Add useDownloadFolder hook

**Files:**

- Modify: `hooks/use-api.ts`

**Step 1: Add the hook at the end of the FOLDERS HOOKS section**

After `useFolderPath`, add:

```typescript
export function useDownloadFolder() {
  return useMutation({
    mutationFn: async (folderId: string) => {
      const response = await fetch(`${API_BASE}/folders/${folderId}/download`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al descargar la carpeta");
      }
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : "carpeta.zip";
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast.success("Descarga de carpeta iniciada");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`

---

### Task 5: Add download option to folder context menu

**Files:**

- Modify: `app/dashboard/documents/page.tsx`

**Step 1: Add Download icon import and onDownload prop to FolderTreeItem**

Add `Download` to the lucide-react imports.

Add `onDownload` prop to FolderTreeItem interface alongside onEdit and onDelete.

**Step 2: Add download menu item to FolderTreeItem dropdown**

Inside the `DropdownMenuContent`, before the "Renombrar" item, add:

```tsx
<DropdownMenuItem onClick={() => onDownload(folder.id)}>
  <Download className="mr-2 h-4 w-4" />
  Descargar carpeta
</DropdownMenuItem>
```

**Step 3: Wire up the download in DocumentsPage**

Add `useDownloadFolder` to imports from `@/hooks/use-api`.

Initialize with `const downloadFolder = useDownloadFolder();`

Pass `onDownload` to FolderTreeItem components:

```tsx
onDownload={(folderId) => downloadFolder.mutate(folderId)}
```

**Step 4: Verify the app builds**

Run: `npm run build`

---

### Task 6: Run lint and type-check

Run: `npm run lint && npm run type-check`

Fix any issues found.

---

### Task 7: Commit changes

```bash
git add -A
git commit -m "feat: add folder download as ZIP feature"
```
