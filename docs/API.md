# API Documentation

Complete API reference for SGDE system.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All API endpoints (except `/api/auth/*`) require authentication via NextAuth.js session.

### Session Cookie

Requests must include the NextAuth session cookie obtained after login.

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "clxxx",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation:**

- Name: min 2 characters, max 100
- Email: valid email format
- Password: min 8 characters, must include uppercase, lowercase, and number

---

### Login

**Endpoint:** `POST /api/auth/signin`

Handled by NextAuth.js. Use the session provider in the frontend.

---

## Document Endpoints

### List Documents

Get paginated list of documents with filters.

**Endpoint:** `GET /api/documents`

**Query Parameters:**

- `query` (optional): Search query
- `categoryId` (optional): Filter by category
- `tagId` (optional): Filter by tag
- `source` (optional): Filter by source (local, google_drive, one_drive)
- `status` (optional): Filter by status (active, archived, deleted)
- `uploadedBy` (optional): Filter by uploader user ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `sortBy` (optional): Sort field (createdAt, updatedAt, title, fileSize)
- `sortOrder` (optional): Sort order (asc, desc)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "clxxx",
        "title": "Document Title",
        "description": "Document description",
        "fileName": "file.pdf",
        "fileSize": 1024000,
        "mimeType": "application/pdf",
        "fileUrl": "https://...",
        "source": "local",
        "status": "active",
        "uploadedBy": "clxxx",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "clxxx",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "categories": [...],
        "tags": [...]
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

**Required Permission:** `document:read`

---

### Create Document

Upload a new document.

**Endpoint:** `POST /api/documents`

**Request Body:**

```json
{
  "title": "Document Title",
  "description": "Optional description",
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "mimeType": "application/pdf",
  "fileUrl": "https://uploadthing.com/...",
  "source": "local",
  "categoryIds": ["clxxx", "clyyy"],
  "tagIds": ["clxxx", "clyyy"]
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Document created successfully",
  "data": {
    "id": "clxxx",
    "title": "Document Title",
    ...
  }
}
```

**Required Permission:** `document:create`

---

### Get Document by ID

Get detailed information about a specific document.

**Endpoint:** `GET /api/documents/:id`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "clxxx",
    "title": "Document Title",
    "description": "Description",
    "fileName": "file.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "fileUrl": "https://...",
    "source": "local",
    "status": "active",
    "user": {...},
    "categories": [...],
    "tags": [...],
    "versions": [...],
    "shares": [...]
  }
}
```

**Required Permission:** `document:read`

---

### Update Document

Update document metadata.

**Endpoint:** `PATCH /api/documents/:id`

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "active",
  "categoryIds": ["clxxx"],
  "tagIds": ["clxxx"]
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Document updated successfully",
  "data": {...}
}
```

**Required Permission:** `document:update`

---

### Delete Document

Soft delete a document (sets status to deleted).

**Endpoint:** `DELETE /api/documents/:id`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Document deleted successfully",
  "data": {
    "success": true
  }
}
```

**Required Permission:** `document:delete`

---

## File Upload

### Upload Files

Upload files using UploadThing.

**Endpoint:** `POST /api/uploadthing`

Use the UploadThing client SDK for file uploads.

**Supported File Types:**

- Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV
- Images: JPEG, PNG, GIF, WEBP, SVG
- Archives: ZIP, RAR, 7Z

**Limits:**

- Max file size: 50MB (documents), 10MB (images), 100MB (archives)
- Max files per upload: 10
- Max total size per upload: 100MB

**Required Permission:** Must be authenticated

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

**Common Status Codes:**

- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## RBAC Permissions

### Resources

- `document` - Document operations
- `user` - User management
- `role` - Role management
- `permission` - Permission management
- `category` - Category management
- `tag` - Tag management
- `audit_log` - Audit log access
- `cloud_integration` - Cloud integration management

### Actions

- `create` - Create new resource
- `read` - View resource
- `update` - Modify resource
- `delete` - Remove resource
- `manage` - Full control
- `share` - Share documents
- `download` - Download documents

### Permission Format

`{resource}:{action}`

Examples:

- `document:create`
- `document:read`
- `user:update`
- `role:manage`

---

## Default Roles

### Super Admin

Full system access with all permissions.

### Admin

- Manage documents, users, categories
- View audit logs
- Cannot manage roles/permissions

### Coordinator

- Create, read, update, share documents
- Manage categories and tags
- Limited to their department

### Teacher

- Create, read, update, share own documents
- View categories and tags
- Download shared documents

### Student

- Read shared documents
- Download documents
- View categories and tags

---

## Rate Limiting

Not currently implemented. Consider adding rate limiting in production:

- Authentication: 5 requests per minute per IP
- File uploads: 10 requests per minute per user
- API calls: 100 requests per minute per user

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**

- `page`: Page number (starts at 1)
- `limit`: Items per page (default 20, max 100)

**Response includes:**

```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## Sorting

List endpoints support sorting:

**Query Parameters:**

- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`

Example:

```
GET /api/documents?sortBy=createdAt&sortOrder=desc
```

---

## Filtering

Documents support advanced filtering:

**Example:**

```
GET /api/documents?query=project&categoryId=clxxx&source=local&status=active
```

Combines multiple filters with AND logic.

---

## Audit Logging

All operations are automatically logged in the audit log:

**Logged Information:**

- User ID
- Action performed
- Resource type and ID
- Timestamp
- IP address (future)
- User agent (future)

View audit logs with `audit_log:read` permission.

---

## Cloud Integration

### Google Drive

**Connect:** Handled via OAuth flow
**List Files:** Use Google Drive service
**Download:** Use Google Drive service

### OneDrive

**Connect:** Handled via OAuth flow
**List Files:** Use OneDrive service
**Download:** Use OneDrive service

---

## Webhooks

Not currently implemented. Future feature for:

- Document upload notifications
- Permission changes
- Integration status updates

---

## Development

### Base URL (Development)

```
http://localhost:3000/api
```

### Base URL (Production)

```
https://your-domain.com/api
```

### Testing

Use tools like:

- Postman
- Thunder Client
- curl
- Insomnia

### Example curl Request

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

---

## Changelog

### Version 1.0.0 (Initial Release)

- User authentication (credentials + Google OAuth)
- Document CRUD operations
- File upload with UploadThing
- RBAC system
- Audit logging
- Cloud integrations (Google Drive, OneDrive)
- Categories and tags
- Document sharing
- Search and filters

---

## Support

For issues and questions:

- GitHub Issues: [repository-url]
- Documentation: See `docs/` folder
- Email: support@sgde.local
