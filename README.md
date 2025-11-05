# SGDE - Sistema de Gestion Documental Educativa

A modern, scalable document management system designed specifically for educational institutions. Built with Next.js 14, TypeScript, and PostgreSQL.

## Overview

SGDE is a comprehensive document management platform that enables universities and educational institutions to efficiently manage, organize, and share important documents. The system provides role-based access control, cloud integration, and an intuitive interface designed for users with varying levels of technical expertise.

## Key Features

- **Authentication & Authorization**: Secure user authentication with NextAuth.js and granular role-based permissions
- **Document Management**: Upload, organize, version, and share documents with advanced metadata
- **Cloud Integration**: Seamlessly connect with Google Drive, Microsoft OneDrive, and other cloud storage providers
- **Role-Based Access Control (RBAC)**: Flexible permission system with predefined roles (Super Admin, Admin, Coordinator, Teacher, Student)
- **Advanced Search**: Full-text search with filters by category, tags, dates, and more
- **Audit Logging**: Complete activity tracking for compliance and security
- **Responsive UI**: Mobile-first design with accessibility in mind
- **Type-Safe**: End-to-end TypeScript for reliability and developer experience

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand + TanStack Query

### Backend

- **Runtime**: Node.js (Next.js API Routes)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **File Storage**: UploadThing (configurable)

### Cloud Integrations

- **Google Drive**: googleapis
- **Microsoft OneDrive**: Microsoft Graph API
- **Storage**: AWS S3 compatible (via UploadThing)

### Development Tools

- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode
- **Container**: Docker + Docker Compose

## Project Structure

```
sgde-mvp/
├── app/                        # Next.js App Router pages
├── components/                 # React components
│   ├── ui/                    # Reusable UI components (shadcn/ui)
│   ├── features/              # Feature-specific components
│   │   ├── auth/             # Authentication components
│   │   ├── documents/        # Document management components
│   │   ├── users/            # User management components
│   │   └── roles/            # Role management components
│   └── layouts/              # Layout components
│       ├── dashboard/        # Dashboard layout
│       └── public/           # Public pages layout
├── lib/                       # Core business logic (Clean Architecture)
│   ├── domain/               # Domain layer
│   │   ├── entities/        # Business entities
│   │   ├── value-objects/   # Value objects
│   │   └── repositories/    # Repository interfaces
│   ├── application/          # Application layer
│   │   ├── use-cases/       # Business use cases
│   │   ├── dtos/            # Data transfer objects
│   │   ├── services/        # Application services
│   │   └── validators/      # Zod schemas
│   ├── infrastructure/       # Infrastructure layer
│   │   ├── database/        # Prisma client
│   │   ├── storage/         # File storage services
│   │   ├── auth/            # Auth configuration
│   │   └── integrations/    # External API integrations
│   └── presentation/         # Presentation layer
│       ├── hooks/           # React hooks
│       └── contexts/        # React contexts
├── config/                    # Application configuration
│   ├── env.config.ts         # Environment variables (type-safe)
│   ├── permissions.config.ts # RBAC permissions
│   └── upload.config.ts      # File upload settings
├── utils/                     # Utility functions
│   ├── api-response.ts       # API response helpers
│   ├── logger.ts             # Logging utility
│   ├── formatters.ts         # Data formatting utilities
│   └── cn.ts                 # Class name utility
├── prisma/                    # Database schema and migrations
│   └── schema.prisma         # Prisma schema
├── types/                     # TypeScript type definitions
├── docs/                      # Additional documentation
├── public/                    # Static assets
└── .env.example              # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 14+
- npm or yarn or pnpm

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd sgde-mvp
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET`: Random secret key (generate with `openssl rand -base64 32`)

4. **Set up the database**

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed the database
npm run db:seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (dev)
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with initial data

## Database Schema

### Core Models

- **User**: User accounts with authentication
- **Role**: User roles (Super Admin, Admin, Coordinator, Teacher, Student)
- **Permission**: Granular permissions (create, read, update, delete, etc.)
- **Document**: Uploaded documents with metadata
- **Category**: Document categorization
- **Tag**: Document tagging for organization
- **AuditLog**: Activity logging for compliance

### Relationships

- Users have many Roles (many-to-many through UserRole)
- Roles have many Permissions (many-to-many through RolePermission)
- Documents belong to Users and have many Categories and Tags
- All operations are logged in AuditLog

## Configuration

### Environment Variables

See `.env.example` for all available configuration options. Key sections:

- **Database**: PostgreSQL connection
- **Authentication**: NextAuth.js configuration
- **File Upload**: UploadThing or S3 credentials
- **Cloud Integrations**: Google Drive and OneDrive API credentials
- **Email**: SMTP settings for notifications (optional)

### Permissions System

The RBAC system is configured in `config/permissions.config.ts`:

- **Resources**: document, user, role, permission, category, tag, audit_log
- **Actions**: create, read, update, delete, manage, share, download
- **Roles**: Predefined roles with specific permission sets

## Security

- **Authentication**: Secure session-based auth with NextAuth.js
- **Password Hashing**: bcrypt with salt rounds
- **CSRF Protection**: Built into Next.js
- **SQL Injection**: Prevented by Prisma ORM
- **XSS Protection**: React escapes by default
- **File Upload**: Type validation and size limits
- **Audit Logging**: All actions are logged

## Development Best Practices

This project follows industry best practices:

1. **Clean Architecture**: Separation of concerns with clear layers
2. **SOLID Principles**: Maintainable and testable code
3. **Type Safety**: Full TypeScript coverage with strict mode
4. **Code Quality**: ESLint + Prettier + Husky pre-commit hooks
5. **Validation**: Zod schemas for all inputs
6. **Error Handling**: Consistent error responses
7. **Logging**: Structured logging for debugging
8. **No Hardcoding**: All config in environment variables
9. **Documentation**: Inline comments and comprehensive docs

## Cloud Integration Setup

### Google Drive

1. Create a project in Google Cloud Console
2. Enable Google Drive API
3. Create OAuth 2.0 credentials
4. Add credentials to `.env`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Microsoft OneDrive

1. Register app in Azure Portal
2. Add Microsoft Graph API permissions
3. Add credentials to `.env`:
   - `MICROSOFT_CLIENT_ID`
   - `MICROSOFT_CLIENT_SECRET`
   - `MICROSOFT_TENANT_ID`

## Deployment

### Docker

```bash
docker-compose up -d
```

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm run start
```

## Contributing

1. Follow the code style (enforced by ESLint/Prettier)
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] Complete authentication system
- [ ] Implement document upload and management
- [ ] Add cloud storage integrations
- [ ] Create admin dashboard
- [ ] Add real-time notifications
- [ ] Implement full-text search
- [ ] Add API documentation
- [ ] Write comprehensive tests
- [ ] Add i18n support
- [ ] Mobile app integration
