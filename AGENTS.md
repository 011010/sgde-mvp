# SGDE - AI Agent Guide

This document helps AI agents understand and work effectively with the SGDE (Sistema de Gestión Documental Educativa) codebase.

## Project Overview

SGDE is a production-ready document management system for educational institutions. It provides role-based access control, document management, cloud integrations (Google Drive, OneDrive), and a complete authentication system.

**Status**: Production Ready (Version 1.1.0)
**Lines of Code**: ~18,000
**Files**: 85+
**Test Coverage**: ~70%

---

## Tech Stack

### Core

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5 (strict mode)
- **Database**: PostgreSQL 15
- **ORM**: Prisma 6
- **Authentication**: NextAuth.js v5 (JWT strategy)

### Frontend

- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI primitives
- **State Management**: Zustand (client), TanStack Query (server)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js (Next.js API Routes)
- **File Storage**: UploadThing (configurable)
- **Cloud**: Google APIs, Microsoft Graph API

### Dev Tools

- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Build**: TypeScript compiler

---

## Architecture

The project follows **Clean Architecture** with 4 distinct layers:

```
lib/
├── domain/              # Business entities (pure TypeScript)
├── application/         # Use cases, services, validators
│   ├── services/       # Business logic (document, auth)
│   └── validators/     # Zod schemas
├── infrastructure/     # External concerns
│   ├── auth/          # NextAuth config, RBAC
│   ├── database/      # Prisma client
│   ├── storage/       # UploadThing
│   └── integrations/  # Google Drive, OneDrive
└── presentation/      # React-specific code
    └── contexts/      # Providers (auth, query)
```

### Key Principles

1. **No dependencies from inner to outer layers**
2. **Domain layer has zero framework dependencies**
3. **All external dependencies are in infrastructure**
4. **Use dependency injection for testability**

### Data Flow

```
User Action → UI Component → API Route → Service → Database
                                    ↓
                              Validation (Zod)
                                    ↓
                              Authorization (RBAC)
```

---

## Project Structure

```
sgde-mvp/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Auth endpoints (NextAuth, register)
│   │   ├── documents/          # Document CRUD
│   │   ├── uploadthing/        # File upload
│   │   └── health/             # Health check
│   ├── auth/                    # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/               # Protected dashboard
│   │   ├── documents/
│   │   ├── layout.tsx          # Dashboard wrapper
│   │   └── page.tsx            # Dashboard home
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # Base components (16)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── features/              # Feature components
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   └── documents/
│   │       └── documents-table.tsx
│   └── layouts/               # Layout components
│       └── dashboard/
│           ├── sidebar.tsx
│           └── navbar.tsx
├── lib/                        # Business logic (Clean Architecture)
├── config/                     # Configuration
│   ├── env.config.ts          # Type-safe env vars
│   ├── permissions.config.ts  # RBAC config
│   └── upload.config.ts       # Upload settings
├── utils/                      # Utilities
│   ├── api-response.ts        # API response helpers
│   ├── logger.ts              # Logging
│   ├── formatters.ts          # Data formatters
│   └── cn.ts                  # Class name utility
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── types/                      # Global types
├── docs/                       # Documentation
├── public/                     # Static assets
├── middleware.ts               # Auth middleware
└── docker-compose.yml          # Docker setup
```

---

## Database Schema

### Core Models (13)

1. **User** - User accounts with auth
2. **Account** - OAuth accounts (Google)
3. **Session** - NextAuth sessions
4. **Role** - System roles
5. **Permission** - Granular permissions
6. **RolePermission** - Role-Permission mapping
7. **UserRole** - User-Role mapping
8. **Document** - Core document entity
9. **Category** - Document categories
10. **Tag** - Document tags
11. **DocumentCategory/DocumentTag** - Many-to-many relations
12. **AuditLog** - Activity logging
13. **CloudIntegration** - OAuth tokens

### Key Relationships

- **Users ↔ Roles**: Many-to-many (via UserRole)
- **Roles ↔ Permissions**: Many-to-many (via RolePermission)
- **Documents ↔ Categories**: Many-to-many
- **Documents ↔ Tags**: Many-to-many
- **User → Documents**: One-to-many

### Important Fields

```prisma
model Document {
  id          String   @id @default(cuid())
  title       String
  fileName    String
  fileSize    Int
  mimeType    String
  fileUrl     String
  source      String   @default("local")  // local | google_drive | one_drive
  status      String   @default("active") // active | archived | deleted
  uploadedBy  String   // User ID
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## RBAC System

### Roles

| Role            | Description                 |
| --------------- | --------------------------- |
| **super_admin** | Full system access          |
| **admin**       | Manage users and documents  |
| **coordinator** | Manage department documents |
| **teacher**     | Manage own documents        |
| **student**     | View shared documents       |

### Permission Format

```typescript
`${resource}:${action}`;

// Examples:
("document:create");
("document:read");
("document:update");
("document:delete");
("user:manage");
```

### Resources

- `document`, `user`, `role`, `permission`, `category`, `tag`, `audit_log`, `cloud_integration`

### Actions

- `create`, `read`, `update`, `delete`, `manage`, `share`, `download`

### Using RBAC in Code

```typescript
// In API routes
import { requireAuth, requirePermission } from "@/lib/infrastructure/auth/rbac";
import { RESOURCES, ACTIONS } from "@/config/permissions.config";

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.CREATE}`);
  // ... proceed with handler
}

// Check permissions from session
const hasPermission = session.user.permissions.includes("document:delete");
```

---

## API Patterns

### Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Success
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

### API Route Pattern

```typescript
import { NextRequest } from "next/server";
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
    // ... logic
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await requirePermission(`${RESOURCES.DOCUMENT}:${ACTIONS.CREATE}`);
    const body = await request.json();
    // ... validate and create
    return createdResponse(data, "Created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## Validation with Zod

All API inputs are validated with Zod schemas:

```typescript
// lib/application/validators/document.validators.ts
import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  fileName: z.string(),
  fileSize: z.number().positive(),
  mimeType: z.string(),
  fileUrl: z.string().url(),
  source: z.enum(["local", "google_drive", "one_drive"]).default("local"),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
```

---

## Service Layer Pattern

Services contain business logic and database operations:

```typescript
// lib/application/services/document.service.ts
import prisma from "@/lib/infrastructure/database/prisma";

export class DocumentService {
  async createDocument(data: CreateDocumentInput, userId: string) {
    const document = await prisma.document.create({
      data: { ...data, uploadedBy: userId },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Audit logging
    await prisma.auditLog.create({
      data: {
        userId,
        action: "create",
        resource: "document",
        resourceId: document.id,
        details: `Created document: ${document.title}`,
      },
    });

    return document;
  }
}

export const documentService = new DocumentService();
```

---

## UI Components

### Using shadcn/ui Components

Components are in `components/ui/` and follow shadcn/ui patterns:

```typescript
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Button variants: default, destructive, outline, secondary, ghost, link, primary
<Button variant="primary" size="lg">Click me</Button>
```

### Utility Function for Classes

```typescript
import { cn } from "@/utils/cn";

<div className={cn("base-class", condition && "conditional-class")} />
```

---

## Authentication Flow

1. **Registration**: POST `/api/auth/register` → Creates user with bcrypt password → Assigns "student" role
2. **Login**: Uses NextAuth credentials provider → Validates password → Loads roles/permissions → Creates JWT
3. **Session**: JWT stored in cookie → Middleware validates on protected routes → Session provider gives access to user data
4. **Permissions**: Embedded in JWT token for fast validation

### Using Auth in Components

```typescript
"use client";
import { useSession } from "next-auth/react";

export function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please log in</div>;

  return <div>Welcome, {session.user.name}</div>;
}
```

---

## Environment Variables

### Required

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/sgde
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-char-secret
```

### Optional (for full features)

```bash
# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Microsoft OneDrive
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=

# SMTP (for email notifications)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
```

---

## Common Commands

### Development

```bash
npm run dev              # Start dev server (port 3000)
npm run build           # Build for production
npm run start           # Start production server
```

### Database

```bash
npm run db:generate     # Generate Prisma Client
npm run db:migrate      # Run migrations
npm run db:push         # Push schema (dev only)
npm run db:studio       # Open Prisma Studio GUI
npm run db:seed         # Seed with default data
```

### Code Quality (MUST RUN BEFORE COMMIT)

```bash
npm run lint            # Check for linting errors
npm run lint:fix        # Auto-fix linting errors
npm run format          # Format with Prettier
npm run format:check    # Check formatting
npm run type-check      # Run TypeScript compiler
```

### Docker

```bash
docker compose up -d postgres    # Start PostgreSQL only
docker compose up -d             # Start all services
docker compose logs -f           # View logs
```

---

## Important Conventions

### Code Style

1. **TypeScript**: Always use strict typing, no `any`
2. **Imports**: Use `@/` alias for project imports
3. **Functions**: Prefer async/await over callbacks
4. **Error Handling**: Use try-catch with specific error types
5. **Naming**:
   - PascalCase for components and classes
   - camelCase for functions and variables
   - UPPER_SNAKE_CASE for constants

### File Organization

1. **One export per file** for services and utilities
2. **Co-locate validators** with services they validate
3. **Keep components small** (< 200 lines when possible)
4. **Use index files** sparingly

### Error Handling

```typescript
// Good: Specific error handling
try {
  const result = await someOperation();
  return successResponse(result);
} catch (error) {
  if (error instanceof z.ZodError) {
    return errorResponse("Validation failed", 400);
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return errorResponse("Database error", 500);
  }
  return handleApiError(error);
}
```

### Database Queries

```typescript
// Good: Include related data explicitly
const document = await prisma.document.findUnique({
  where: { id },
  include: {
    categories: { include: { category: true } },
    tags: { include: { tag: true } },
    user: { select: { id: true, name: true, email: true } },
  },
});

// Good: Use transactions for related operations
await prisma.$transaction([
  prisma.document.create({ data: { ... } }),
  prisma.auditLog.create({ data: { ... } }),
]);
```

---

## API Reference

### Documents API

| Endpoint                     | Method | Description                 | Permissions       |
| ---------------------------- | ------ | --------------------------- | ----------------- |
| `/api/documents`             | GET    | List documents with filters | `document:read`   |
| `/api/documents`             | POST   | Create new document         | `document:create` |
| `/api/documents/[id]`        | GET    | Get single document         | `document:read`   |
| `/api/documents/[id]`        | PATCH  | Update document             | `document:update` |
| `/api/documents/[id]`        | DELETE | Delete document             | `document:delete` |
| `/api/documents/[id]/share`  | POST   | Share document              | `document:share`  |
| `/api/documents/bulk-delete` | POST   | Bulk delete documents       | `document:delete` |

### Users API

| Endpoint                 | Method | Description      | Permissions   |
| ------------------------ | ------ | ---------------- | ------------- |
| `/api/users`             | GET    | List users       | `user:read`   |
| `/api/users/[id]`        | GET    | Get user details | `user:read`   |
| `/api/users/[id]`        | PATCH  | Update user      | `user:update` |
| `/api/users/[id]`        | DELETE | Delete user      | `user:delete` |
| `/api/users/me`          | GET    | Get current user | Authenticated |
| `/api/users/me`          | PATCH  | Update profile   | Authenticated |
| `/api/users/me/password` | POST   | Change password  | Authenticated |

### Roles API

| Endpoint                 | Method | Description          | Permissions   |
| ------------------------ | ------ | -------------------- | ------------- |
| `/api/roles`             | GET    | List roles           | `role:read`   |
| `/api/roles`             | POST   | Create role          | `role:create` |
| `/api/roles/[id]`        | GET    | Get role details     | `role:read`   |
| `/api/roles/[id]`        | PATCH  | Update role          | `role:update` |
| `/api/roles/[id]`        | DELETE | Delete role          | `role:delete` |
| `/api/roles/permissions` | GET    | List all permissions | `role:read`   |

---

---

## When Making Changes

### Before You Start

1. Check the existing patterns in similar files
2. Review `config/permissions.config.ts` for new permissions
3. Update validators if adding new API inputs
4. Consider audit logging for data changes

### Checklist

- [ ] Follow existing code patterns
- [ ] Add validation with Zod
- [ ] Check permissions with RBAC
- [ ] Add audit logging for data changes
- [ ] Handle errors appropriately
- [ ] Run lint and type-check
- [ ] Test the changes locally

### Common Tasks

#### Adding a New API Endpoint

1. Create route in `app/api/[resource]/route.ts`
2. Add service method in `lib/application/services/[service].ts`
3. Add validator in `lib/application/validators/[resource].validators.ts`
4. Update permissions config if needed
5. Test the endpoint

#### Adding a New Database Model

1. Add model to `prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Run `npm run db:generate`
4. Create service layer
5. Add validators
6. Create API routes

#### Adding a New Permission

1. Add to `DEFAULT_PERMISSIONS` in `config/permissions.config.ts`
2. Assign to roles in `ROLE_PERMISSIONS_MAP`
3. Use in API routes with `requirePermission()`
4. Update session if needed (logout/login to refresh)

---

## Troubleshooting

### Common Issues

**Prisma Client not found**

```bash
npm run db:generate
```

**Database connection errors**

- Check DATABASE_URL in `.env`
- Ensure PostgreSQL is running: `docker compose up -d postgres`

**Type errors**

```bash
npm run type-check
```

**Lint errors**

```bash
npm run lint:fix
npm run format
```

**Permission denied errors**

- Check user's roles: query `UserRole` table
- Verify `ROLE_PERMISSIONS_MAP` in config
- User may need to logout/login to refresh JWT

---

## Default Credentials

After running `npm run db:seed`:

- **Admin**: `admin@sgde.local` / `Admin123!`
- **Default roles**: Super Admin, Admin, Coordinator, Teacher, Student
- **Sample categories**: Academic, Administrative, Financial, HR

---

## External Integrations

### UploadThing (File Upload)

Configured in `lib/infrastructure/storage/uploadthing.ts`. Requires:

- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`

### Google Drive

Service in `lib/infrastructure/integrations/google-drive.service.ts`. Requires OAuth setup.

### OneDrive

Service in `lib/infrastructure/integrations/onedrive.service.ts`. Requires Azure AD app.

---

## Documentation References

- **README.md**: General overview and setup
- **QUICKSTART.md**: 5-minute setup guide
- **PROJECT_OVERVIEW.md**: Complete feature list
- **docs/ARCHITECTURE.md**: Architecture deep dive
- **docs/API.md**: API reference
- **docs/SETUP.md**: Development setup

---

## Testing

### Testing Infrastructure

The project uses **Jest** with **React Testing Library** for comprehensive testing.

**Configuration:**

- `jest.config.mjs` - Jest configuration
- `jest.setup.ts` - Test setup and mocks
- `__tests__/` - Test directory structure

### Running Tests

```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
npm run test:ci         # Run tests for CI (with coverage)
```

### Test Structure

```
__tests__/
├── unit/
│   ├── services/      # Service layer tests
│   ├── validators/    # Zod schema tests
│   └── components/    # Component tests
└── integration/
    └── api/          # API integration tests
```

### Writing Tests

**Unit Tests for Services:**

```typescript
// __tests__/unit/services/document.service.test.ts
import { DocumentService } from "@/lib/application/services/document.service";

describe("DocumentService", () => {
  it("should create a document", async () => {
    // Test implementation
  });
});
```

**Component Tests:**

```typescript
// __tests__/components/share-document-modal.test.tsx
import { render, screen } from "@testing-library/react";
import { ShareDocumentModal } from "@/components/features/documents/share-document-modal";

describe("ShareDocumentModal", () => {
  it("should render share form", () => {
    render(<ShareDocumentModal documentId="1" documentTitle="Test" />);
    expect(screen.getByText("Share Document")).toBeInTheDocument();
  });
});
```

### Coverage Requirements

Minimum coverage thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

---

## New Features (Phase 2)

### Document Sharing

UI component: `components/features/documents/share-document-modal.tsx`

**Features:**

- Share documents with specific email addresses
- Set permission levels (view, edit, admin)
- Set expiration dates
- API endpoint: `POST /api/documents/[id]/share`

**Usage:**

```typescript
import { ShareDocumentModal } from "@/components/features/documents/share-document-modal";
import { useShareDocument } from "@/hooks/use-api";

// In component
<ShareDocumentModal documentId={doc.id} documentTitle={doc.title} />
```

### Document Preview

UI component: `components/features/documents/document-preview.tsx`

**Features:**

- Preview images, PDFs, and text files
- Zoom controls for images
- Download and open in new tab buttons
- File metadata display

**Supported formats:**

- Images: JPEG, PNG, GIF, SVG, WebP
- Documents: PDF
- Text: TXT, JSON, JavaScript, TypeScript

### Cloud Integration

UI component: `components/features/documents/cloud-integration-modal.tsx`

**Features:**

- Import files from Google Drive
- Import files from OneDrive
- File browser with folder navigation
- Bulk file selection
- API endpoint: `GET /api/cloud/[provider]/files`

### Bulk Operations

**Bulk Delete:**

- API endpoint: `POST /api/documents/bulk-delete`
- Hook: `useBulkDeleteDocuments()`
- Delete multiple documents at once
- Partial success handling (reports succeeded/failed counts)

---

## Notes for AI Agents

1. **Always run lint and type-check** before completing any task
2. **Never commit secrets** or hardcode API keys
3. **Follow existing patterns** - look at similar files before creating new ones
4. **Use the service layer** for business logic, not in API routes
5. **Add audit logging** for any data-changing operations
6. **Check permissions** on all protected endpoints
7. **Validate all inputs** with Zod schemas
8. **Handle errors** gracefully with appropriate HTTP status codes
9. **Use TypeScript strict mode** - no `any` types
10. **Write tests** for new features and services
11. **Run tests** before committing: `npm test`
12. **Test locally** before considering a task complete

---

## Quick Reference

| Task               | File/Command                                      |
| ------------------ | ------------------------------------------------- |
| Add API endpoint   | `app/api/[route]/route.ts`                        |
| Add business logic | `lib/application/services/[name].service.ts`      |
| Add validator      | `lib/application/validators/[name].validators.ts` |
| Add permission     | `config/permissions.config.ts`                    |
| Add DB model       | `prisma/schema.prisma`                            |
| Check auth         | `middleware.ts` or `requireAuth()`                |
| Check permission   | `requirePermission("resource:action")`            |
| API response       | `utils/api-response.ts`                           |
| Logger             | `utils/logger.ts`                                 |
| Format data        | `utils/formatters.ts`                             |
| Lint code          | `npm run lint`                                    |
| Type check         | `npm run type-check`                              |

---

**Last Updated**: 2025-02-17
**Version**: 1.1.0
