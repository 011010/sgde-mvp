# Role Visibility, Subfolders & SGDI Rename Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restrict dashboard module visibility by role, add infinite subfolder support, and rename branding from SGDE to SGDI.

**Architecture:**

1. Module visibility: centralized config maps dashboard routes to allowed roles; sidebar and middleware filter accordingly.
2. Subfolders: `parentId` on Folder model enables tree hierarchy; service builds tree from flat query; UI renders expandable tree + breadcrumbs.
3. Rename: UI-only changes (sidebar logo, page titles, login/register pages, env config). DB and Docker names stay as-is.

**Tech Stack:** Next.js 16, TypeScript 5, Prisma 6, Tailwind CSS 4, shadcn/ui, Lucide icons

---

## Task 1: Add module visibility config

**Files:**

- Modify: `config/permissions.config.ts`

**Step 1: Add MODULE_VISIBILITY map**

Add after line 116 (after `ROLE_PERMISSIONS_MAP`):

```typescript
export const MODULE_VISIBILITY: Record<string, string[]> = {
  "/dashboard": [
    DEFAULT_ROLES.SUPER_ADMIN,
    DEFAULT_ROLES.ADMIN,
    DEFAULT_ROLES.COORDINATOR,
    DEFAULT_ROLES.TEACHER,
    DEFAULT_ROLES.STUDENT,
  ],
  "/dashboard/documents": [
    DEFAULT_ROLES.SUPER_ADMIN,
    DEFAULT_ROLES.ADMIN,
    DEFAULT_ROLES.COORDINATOR,
    DEFAULT_ROLES.TEACHER,
    DEFAULT_ROLES.STUDENT,
  ],
  "/dashboard/categories": [
    DEFAULT_ROLES.SUPER_ADMIN,
    DEFAULT_ROLES.ADMIN,
    DEFAULT_ROLES.COORDINATOR,
  ],
  "/dashboard/tags": [DEFAULT_ROLES.SUPER_ADMIN, DEFAULT_ROLES.ADMIN],
  "/dashboard/users": [DEFAULT_ROLES.SUPER_ADMIN, DEFAULT_ROLES.ADMIN],
  "/dashboard/roles": [DEFAULT_ROLES.SUPER_ADMIN, DEFAULT_ROLES.ADMIN],
  "/dashboard/audit-logs": [DEFAULT_ROLES.SUPER_ADMIN, DEFAULT_ROLES.ADMIN],
  "/dashboard/settings": [
    DEFAULT_ROLES.SUPER_ADMIN,
    DEFAULT_ROLES.ADMIN,
    DEFAULT_ROLES.COORDINATOR,
    DEFAULT_ROLES.TEACHER,
    DEFAULT_ROLES.STUDENT,
  ],
};

export function canAccessModule(roles: string[], pathname: string): boolean {
  const allowedRoles = MODULE_VISIBILITY[pathname];
  if (!allowedRoles) return true;
  return roles.some((role) => allowedRoles.includes(role));
}
```

**Step 2: Run type-check**

Run: `npm run type-check`
Expected: PASS

**Step 3: Commit**

```bash
git add config/permissions.config.ts
git commit -m "feat: add module visibility config by role"
```

---

## Task 2: Filter sidebar navigation by role

**Files:**

- Modify: `components/layouts/dashboard/sidebar.tsx`

**Step 1: Import visibility config and filter navigation**

Replace the imports at the top with:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Users,
  Settings,
  FolderOpen,
  Tag,
  GraduationCap,
  Shield,
  ScrollText,
  LogOut,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MODULE_VISIBILITY } from "@/config/permissions.config";
```

**Step 2: Add helper function inside Sidebar component**

Add after line 57 (after `const { data: session } = useSession();`):

```typescript
const userRoles = (session?.user as { roles?: string[] })?.roles || [];

const canAccess = (href: string): boolean => {
  const allowedRoles = MODULE_VISIBILITY[href];
  if (!allowedRoles) return true;
  return userRoles.some((role) => allowedRoles.includes(role));
};
```

**Step 3: Filter mainNavigation rendering**

Replace lines 96-122 with:

```typescript
        {mainNavigation.filter((item) => canAccess(item.href)).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
```

**Step 4: Conditionally render admin section**

Replace lines 124-149 with:

```typescript
        {adminNavigation.some((item) => canAccess(item.href)) && (
          <>
            <div className="mt-6 mb-2 px-3">
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                Administración
              </p>
            </div>

            {adminNavigation.filter((item) => canAccess(item.href)).map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </>
        )}
```

**Step 5: Filter preferences navigation**

Replace lines 157-176 with:

```typescript
        {preferencesNavigation.filter((item) => canAccess(item.href)).map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
```

**Step 6: Run type-check**

Run: `npm run type-check`
Expected: PASS

**Step 7: Commit**

```bash
git add components/layouts/dashboard/sidebar.tsx
git commit -m "feat: filter sidebar navigation by user role"
```

---

## Task 3: Protect dashboard routes in middleware

**Files:**

- Modify: `middleware.ts`

**Step 1: Add role-based route protection**

Replace the middleware function with:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { MODULE_VISIBILITY } from "@/config/permissions.config";

// Decode JWT payload without verification (middleware can't use jose easily)
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies (NextAuth v5 uses different cookie names)
  const authToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!authToken;

  const isAuthRoute = pathname.startsWith("/auth");
  const isPublicRoute = pathname === "/" || isAuthRoute;
  const isApiRoute = pathname.startsWith("/api");
  const isStaticRoute =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    (pathname.includes(".") && !pathname.startsWith("/api"));

  // Allow static files and API routes
  if (isStaticRoute || isApiRoute) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Role-based route protection for dashboard
  if (isLoggedIn && pathname.startsWith("/dashboard")) {
    const payload = decodeJwtPayload(authToken);
    const userRoles = (payload?.roles as string[]) || [];

    // Find exact match or longest prefix match
    const matchedRoute = Object.keys(MODULE_VISIBILITY).find(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (matchedRoute) {
      const allowedRoles = MODULE_VISIBILITY[matchedRoute];
      const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
```

**Step 2: Run type-check**

Run: `npm run type-check`
Expected: PASS

**Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add role-based route protection in middleware"
```

---

## Task 4: Add parentId to Folder model

**Files:**

- Modify: `prisma/schema.prisma`

**Step 1: Update Folder model**

Replace lines 122-132 with:

```prisma
model Folder {
  id          String   @id @default(cuid())
  name        String
  description String?
  parentId    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  parent   Folder?  @relation("FolderHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children Folder[] @relation("FolderHierarchy")
  documents Document[]

  @@index([parentId])
  @@map("folders")
}
```

**Step 2: Create migration**

Run: `npx prisma migrate dev --name add_folder_hierarchy`
Expected: Migration created successfully

**Step 3: Regenerate Prisma client**

Run: `npx prisma generate`
Expected: PASS

**Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add parentId to Folder model for subfolder hierarchy"
```

---

## Task 5: Update folder service for hierarchy

**Files:**

- Modify: `lib/application/services/folder.service.ts`

**Step 1: Update interfaces and add tree builder**

Replace the entire file with:

```typescript
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
      const folder = await prisma.folder.findUnique({
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

      const folder = await prisma.folder.findUnique({
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
```

**Step 2: Run type-check**

Run: `npm run type-check`
Expected: PASS

**Step 3: Commit**

```bash
git add lib/application/services/folder.service.ts
git commit -m "feat: add folder tree builder and hierarchy support to service"
```

---

## Task 6: Update folder validators

**Files:**

- Create: `lib/application/validators/folder.validators.ts`

**Step 1: Create folder validators**

```typescript
import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  parentId: z.string().nullable().optional(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
```

**Step 2: Update folder API routes to use validators**

Replace `app/api/folders/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { folderService } from "@/lib/application/services/folder.service";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";
import { createFolderSchema } from "@/lib/application/validators/folder.validators";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const tree = searchParams.get("tree");

    if (tree === "true") {
      const folders = await folderService.getFolderTree();
      return successResponse(folders);
    }

    const folders = await folderService.getFolders();
    return successResponse(folders);
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
    const body = await request.json();
    const data = createFolderSchema.parse(body);
    const folder = await folderService.createFolder(data, user.id);
    return createdResponse(folder, "Carpeta creada exitosamente");
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}
```

Replace `app/api/folders/[id]/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { folderService } from "@/lib/application/services/folder.service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";
import { updateFolderSchema } from "@/lib/application/validators/folder.validators";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const folder = await folderService.getFolderById(id);
    return successResponse(folder);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message === "Folder not found") return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = updateFolderSchema.parse(body);
    const folder = await folderService.updateFolder(id, data, user.id);
    return successResponse(folder, "Carpeta actualizada exitosamente");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message === "Folder not found") return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const result = await folderService.deleteFolder(id, user.id);
    return successResponse(result, "Carpeta eliminada exitosamente");
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return unauthorizedResponse();
      if (error.message === "Folder not found") return errorResponse(error.message, 404);
    }
    return handleApiError(error);
  }
}
```

**Step 3: Add folder path API endpoint**

Create `app/api/folders/[id]/path/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { folderService } from "@/lib/application/services/folder.service";
import { successResponse, unauthorizedResponse, handleApiError } from "@/utils/api-response";
import { requireAuth } from "@/lib/infrastructure/auth/rbac";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const path = await folderService.getFolderPath(id);
    return successResponse(path);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    return handleApiError(error);
  }
}
```

**Step 4: Run type-check**

Run: `npm run type-check`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/application/validators/folder.validators.ts app/api/folders/route.ts app/api/folders/[id]/route.ts app/api/folders/[id]/path/route.ts
git commit -m "feat: add folder validators, tree endpoint, and path endpoint"
```

---

## Task 7: Update folder hooks for tree and path

**Files:**

- Modify: `hooks/use-api.ts`

**Step 1: Add new hooks after existing folder hooks (after line ~571)**

```typescript
export function useFolderTree() {
  return useQuery({
    queryKey: ["folders", "tree"],
    queryFn: async () => {
      const response = await fetch("/api/folders?tree=true");
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data as import("@/lib/application/services/folder.service").FolderTreeNode[];
    },
  });
}

export function useFolderPath(folderId: string | null) {
  return useQuery({
    queryKey: ["folders", folderId, "path"],
    queryFn: async () => {
      if (!folderId) return [];
      const response = await fetch(`/api/folders/${folderId}/path`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data as Array<{ id: string; name: string }>;
    },
    enabled: !!folderId,
  });
}
```

**Step 2: Run type-check**

Run: `npm run type-check`
Expected: PASS

**Step 3: Commit**

```bash
git add hooks/use-api.ts
git commit -m "feat: add folder tree and path hooks"
```

---

## Task 8: Update documents page with folder tree UI

**Files:**

- Modify: `app/dashboard/documents/page.tsx`

**Step 1: Update imports**

Add to imports:

```typescript
import { useFolderTree, useFolderPath } from "@/hooks/use-api";
import type { FolderTreeNode } from "@/lib/application/services/folder.service";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
```

**Step 2: Add folder tree component**

Add a `FolderTreeItem` component before the main page component:

```typescript
function FolderTreeItem({
  folder,
  level,
  selectedFolderId,
  onSelect,
  expandedFolders,
  onToggle,
}: {
  folder: FolderTreeNode;
  level: number;
  selectedFolderId: string | null;
  onSelect: (id: string | null) => void;
  expandedFolders: Set<string>;
  onToggle: (id: string) => void;
}) {
  const isExpanded = expandedFolders.has(folder.id);
  const isSelected = selectedFolderId === folder.id;
  const hasChildren = folder.children.length > 0;

  return (
    <div>
      <button
        onClick={() => onSelect(folder.id)}
        className={cn(
          "flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm transition-colors",
          isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(folder.id);
            }}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-4.5" />
        )}
        {isSelected ? (
          <FolderOpen className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <Folder className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate">{folder.name}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {folder.documentCount}
        </span>
      </button>
      {isExpanded && hasChildren && (
        <div>
          {folder.children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onSelect={onSelect}
              expandedFolders={expandedFolders}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 3: Update the page component to use tree**

Replace the folder sidebar section (lines ~179-274) with:

```typescript
const { data: folderTree = [] } = useFolderTree();
const { data: folderPath = [] } = useFolderPath(selectedFolderId);

const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

const toggleFolder = (id: string) => {
  setExpandedFolders((prev) => {
    const next = new Set(prev);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  });
};
```

And in the sidebar JSX, replace the folder list with:

```typescript
          {/* All Documents */}
          <button
            onClick={() => setSelectedFolderId(null)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
              selectedFolderId === null
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Todos los documentos</span>
          </button>

          {/* Folder Tree */}
          {folderTree.map((folder) => (
            <FolderTreeItem
              key={folder.id}
              folder={folder}
              level={0}
              selectedFolderId={selectedFolderId}
              onSelect={setSelectedFolderId}
              expandedFolders={expandedFolders}
              onToggle={toggleFolder}
            />
          ))}
```

**Step 4: Update breadcrumb to show full path**

Replace the breadcrumb section (lines ~278-287) with:

```typescript
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <button
            onClick={() => setSelectedFolderId(null)}
            className="hover:text-foreground transition-colors"
          >
            Todos
          </button>
          {folderPath.map((segment, index) => (
            <Fragment key={segment.id}>
              <ChevronRight className="h-3.5 w-3.5" />
              <button
                onClick={() => setSelectedFolderId(segment.id)}
                className={cn(
                  "hover:text-foreground transition-colors",
                  index === folderPath.length - 1 && "text-foreground font-medium"
                )}
              >
                {segment.name}
              </button>
            </Fragment>
          ))}
        </div>
```

**Step 5: Update create folder to support parentId**

Update the create folder dialog to include a hidden parentId when a folder is selected.

**Step 6: Run type-check**

Run: `npm run type-check`
Expected: PASS

**Step 7: Commit**

```bash
git add app/dashboard/documents/page.tsx
git commit -m "feat: implement folder tree UI with expand/collapse and breadcrumbs"
```

---

## Task 9: Rename SGDE to SGDI in UI/branding

**Files:**

- Modify: `components/layouts/dashboard/sidebar.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/auth/login/page.tsx`
- Modify: `app/auth/register/page.tsx`
- Modify: `config/env.config.ts`
- Modify: `.env`
- Modify: `.env.example`

**Step 1: Sidebar logo**

Replace `<span className="text-lg font-bold text-white">SGDE</span>` with `<span className="text-lg font-bold text-white">SGDI</span>` in `components/layouts/dashboard/sidebar.tsx:84`

**Step 2: Page metadata**

Replace `"SGDE - Sistema de Gestion Documental Educativa"` with `"SGDI - Sistema de Gestion Documental Integral"` in `app/layout.tsx:15`

**Step 3: Landing page footer**

Replace `<span className="font-semibold">SGDE</span>` with `<span className="font-semibold">SGDI</span>` in `app/page.tsx`

**Step 4: Login page (3 locations)**

In `app/auth/login/page.tsx`:

- Replace `<span className="text-2xl font-bold">SGDE</span>` → `SGDI`
- Replace `SGDE — Sistema de Gestion Documental Educativa` → `SGDI — Sistema de Gestion Documental Integral`
- Replace `<h1 className="text-2xl font-bold">SGDE</h1>` → `SGDI`

**Step 5: Register page (4 locations)**

In `app/auth/register/page.tsx`:

- Replace `<span className="text-2xl font-bold">SGDE</span>` → `SGDI`
- Replace `ya usan SGDE` → `ya usan SGDI`
- Replace `SGDE — Sistema de Gestion Documental Educativa` → `SGDI — Sistema de Gestion Documental Integral`
- Replace `<h1 className="text-2xl font-bold">SGDE</h1>` → `SGDI`

**Step 6: Config defaults**

In `config/env.config.ts`:

- Replace `"SGDE"` with `"SGDI"` (APP_NAME default)
- Replace `"noreply@sgde.local"` with `"noreply@sgdi.local"` (SMTP_FROM default)

**Step 7: Environment files**

In `.env` and `.env.example`:

- Replace `APP_NAME="SGDE"` with `APP_NAME="SGDI"`
- Replace `SMTP_FROM="noreply@sgde.local"` with `SMTP_FROM="noreply@sgdi.local"`

**Step 8: Run type-check and lint**

Run: `npm run type-check && npm run lint`
Expected: PASS

**Step 9: Commit**

```bash
git add components/layouts/dashboard/sidebar.tsx app/layout.tsx app/page.tsx app/auth/login/page.tsx app/auth/register/page.tsx config/env.config.ts .env .env.example
git commit -m "feat: rename branding from SGDE to SGDI"
```

---

## Task 10: Final verification

**Step 1: Run full type-check**

Run: `npm run type-check`
Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Run tests**

Run: `npm test`
Expected: All tests pass

**Step 4: Rebuild Docker and verify**

Run: `docker compose down && docker compose build --no-cache && docker compose up -d`
Expected: Both containers healthy

**Step 5: Verify health endpoint**

Run: `curl -s http://localhost:3001/api/health`
Expected: 200 OK
