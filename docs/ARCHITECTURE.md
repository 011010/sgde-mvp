# Architecture Documentation

## Overview

SGDE follows **Clean Architecture** principles with clear separation of concerns across multiple layers. This ensures maintainability, testability, and scalability.

## Architectural Layers

### 1. Domain Layer (`lib/domain/`)

The innermost layer containing core business logic and entities. This layer has no dependencies on outer layers.

**Components:**

- **Entities**: Core business objects (User, Document, Role, etc.)
- **Value Objects**: Immutable objects defined by their values
- **Repository Interfaces**: Contracts for data access

**Key Principles:**

- Pure TypeScript/JavaScript
- No framework dependencies
- Business rules and invariants
- Platform-independent

### 2. Application Layer (`lib/application/`)

Contains application-specific business rules and use cases. Orchestrates the flow of data between layers.

**Components:**

- **Use Cases**: Application-specific business operations
- **DTOs**: Data transfer objects for input/output
- **Services**: Application services
- **Validators**: Input validation with Zod

**Key Principles:**

- Uses domain entities
- Implements business workflows
- No UI or infrastructure concerns
- Testable in isolation

### 3. Infrastructure Layer (`lib/infrastructure/`)

Handles external concerns like databases, file storage, and third-party APIs.

**Components:**

- **Database**: Prisma client and migrations
- **Storage**: File upload services (UploadThing, S3)
- **Auth**: Authentication providers
- **Integrations**: External API clients (Google Drive, OneDrive)

**Key Principles:**

- Implements repository interfaces from domain
- Handles data persistence
- External API communication
- Environment-specific logic

### 4. Presentation Layer (`lib/presentation/` and `components/`)

Handles user interface concerns including React components, hooks, and contexts.

**Components:**

- **Hooks**: Custom React hooks
- **Contexts**: React context providers
- **UI Components**: Reusable UI elements
- **Feature Components**: Feature-specific components
- **Layouts**: Page layouts

**Key Principles:**

- React-specific code
- UI state management
- User interaction handling
- Responsive design

## Data Flow

```
User Interaction
    ↓
Presentation Layer (React Components)
    ↓
Application Layer (Use Cases)
    ↓
Domain Layer (Business Logic)
    ↓
Infrastructure Layer (Database/APIs)
    ↓
External Services (PostgreSQL, Cloud Storage)
```

## Design Patterns

### 1. Repository Pattern

Abstracts data access logic and provides a collection-like interface for accessing domain entities.

```typescript
// Domain layer interface
interface DocumentRepository {
  findById(id: string): Promise<Document | null>;
  save(document: Document): Promise<Document>;
  delete(id: string): Promise<void>;
}

// Infrastructure layer implementation
class PrismaDocumentRepository implements DocumentRepository {
  // Implementation using Prisma
}
```

### 2. Dependency Injection

Dependencies are injected rather than hard-coded, making code testable and flexible.

```typescript
// Use case depends on repository interface, not implementation
class CreateDocumentUseCase {
  constructor(private documentRepo: DocumentRepository) {}

  async execute(data: CreateDocumentDTO): Promise<Document> {
    // Business logic here
  }
}
```

### 3. Factory Pattern

Used for creating complex objects with multiple dependencies.

### 4. Strategy Pattern

Used for cloud integrations where different strategies handle different providers.

## Component Architecture

### UI Components Structure

```
components/
├── ui/                    # Basic, reusable components
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
├── features/              # Feature-specific components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── documents/
│       ├── DocumentCard.tsx
│       └── DocumentUpload.tsx
└── layouts/               # Page layouts
    ├── DashboardLayout.tsx
    └── PublicLayout.tsx
```

### Feature Organization

Each feature follows a consistent structure:

```
features/documents/
├── components/            # UI components
├── hooks/                # Custom hooks
├── types/                # TypeScript types
├── utils/                # Utility functions
└── constants/            # Feature-specific constants
```

## State Management Strategy

### Server State (TanStack Query)

- API data fetching
- Caching and synchronization
- Background updates
- Optimistic updates

### Client State (Zustand)

- UI state (modals, drawers)
- Form state (multi-step forms)
- User preferences
- Temporary data

### URL State (Next.js Router)

- Pagination
- Filters
- Search queries
- Tab selection

## API Route Structure

```
app/api/
├── auth/                  # Authentication endpoints
├── documents/             # Document CRUD
├── users/                 # User management
├── roles/                 # Role management
└── integrations/          # Cloud integrations
```

Each API route follows this pattern:

1. **Validate Request**: Zod schema validation
2. **Authenticate**: Check user session
3. **Authorize**: Check permissions
4. **Execute Use Case**: Business logic
5. **Return Response**: Consistent format
6. **Error Handling**: Catch and log errors

## Database Design

### Naming Conventions

- Tables: Plural, lowercase with underscores (e.g., `users`, `documents`)
- Columns: camelCase in Prisma, snake_case in database
- Foreign keys: `{entity}Id` format
- Indexes: Prefix with `idx_`

### Relationships

- One-to-Many: User → Documents
- Many-to-Many: Users ↔ Roles (through `user_roles`)
- Polymorphic: AuditLog references multiple entities

### Soft Deletes

Documents use status field instead of hard deletes for data retention.

## Security Architecture

### Authentication Flow

1. User submits credentials
2. NextAuth validates credentials
3. Session created and stored
4. JWT token issued
5. Token included in subsequent requests

### Authorization Flow

1. Extract user from session
2. Load user roles and permissions
3. Check permission for resource/action
4. Allow or deny request

### Data Protection

- Passwords hashed with bcrypt (10 rounds)
- Sensitive data encrypted at rest
- HTTPS enforced in production
- CORS configured for API routes

## File Upload Architecture

### Upload Flow

1. Client selects file
2. Validate file type and size
3. Generate presigned URL (if S3)
4. Upload to storage service
5. Create document record in database
6. Return document metadata

### Storage Strategy

- **Development**: Local UploadThing
- **Production**: AWS S3 or similar
- **Cloud Sync**: Bidirectional with Drive/OneDrive

## Performance Optimizations

### Frontend

- React Server Components for faster initial load
- Lazy loading for code splitting
- Image optimization with Next.js Image
- Memoization for expensive computations

### Backend

- Database query optimization with indexes
- Connection pooling with Prisma
- API response caching
- Pagination for large datasets

### Caching Strategy

- Static pages: Cached at CDN
- Dynamic data: TanStack Query cache
- Database queries: Prisma query caching
- API responses: Cache headers

## Scalability Considerations

### Horizontal Scaling

- Stateless API routes
- Session storage in database (not memory)
- File storage in external service (not local)

### Database Scaling

- Read replicas for read-heavy operations
- Connection pooling
- Query optimization
- Proper indexing

### File Storage Scaling

- CDN for file delivery
- Multiple storage regions
- Lazy loading of large files

## Testing Strategy

### Unit Tests

- Domain layer business logic
- Utility functions
- Validators

### Integration Tests

- API routes
- Database operations
- Use cases

### E2E Tests

- Critical user flows
- Authentication
- Document upload/download

## Monitoring and Logging

### Application Logs

- Structured logging with context
- Log levels: debug, info, warn, error
- Sensitive data redaction

### Metrics

- API response times
- Database query performance
- Error rates
- User actions

### Audit Trail

- All CRUD operations logged
- User identification
- Timestamp
- IP address and user agent

## Deployment Architecture

### Development

- Local PostgreSQL
- Local file storage
- Debug logging enabled

### Staging

- Cloud database
- Cloud file storage
- Production-like environment

### Production

- Managed database (RDS, etc.)
- CDN-backed storage
- Error tracking (Sentry)
- Performance monitoring

## Future Considerations

### Microservices

Currently monolithic, but designed for easy extraction:

- Document service
- Auth service
- Integration service

### Event-Driven Architecture

- Event bus for loose coupling
- Async processing for heavy tasks
- Real-time notifications via WebSockets

### Multi-tenancy

- Tenant isolation at database level
- Per-tenant configuration
- Resource quotas
