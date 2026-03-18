# Development Setup Guide

Complete guide for setting up the SGDE development environment.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)

   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **PostgreSQL** (v14 or higher)

   ```bash
   psql --version  # Should be 14.x or higher
   ```

3. **Git**

   ```bash
   git --version
   ```

4. **npm** (comes with Node.js) or **yarn** or **pnpm**
   ```bash
   npm --version
   ```

### Optional but Recommended

- **Docker** (for containerized development)
- **VSCode** (recommended IDE with extensions)
- **Postman** or **Thunder Client** (API testing)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sgde-mvp
```

### 2. Install Dependencies

```bash
npm install
```

This will install all project dependencies including:

- Runtime dependencies (React, Next.js, Prisma, etc.)
- Development dependencies (ESLint, Prettier, TypeScript, etc.)
- Husky git hooks for code quality

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

```bash
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/sgde_dev?schema=public"

# NextAuth - Generate a secret key
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Optional: Cloud integrations (can be set up later)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

MICROSOFT_CLIENT_ID=""
MICROSOFT_CLIENT_SECRET=""

# UploadThing v7: single token (replaces old UPLOADTHING_SECRET + UPLOADTHING_APP_ID)
UPLOADTHING_TOKEN=""
```

### 4. Set Up Database

#### Option A: Local PostgreSQL

1. **Create database:**

   ```bash
   createdb sgde_dev
   ```

2. **Generate Prisma Client:**

   ```bash
   npm run db:generate
   ```

3. **Run migrations:**

   ```bash
   npm run db:migrate
   ```

4. **Seed database (optional):**
   ```bash
   npm run db:seed
   ```

#### Option B: Docker PostgreSQL

1. **Start PostgreSQL container:**

   ```bash
   docker run --name sgde-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=sgde_dev \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Follow steps 2-4 from Option A**

### 5. Verify Setup

Run the development server:

```bash
npm run dev
```

Visit http://localhost:3000 - you should see the application.

## Development Workflow

### Code Quality Checks

The project enforces code quality through pre-commit hooks:

```bash
# Manual checks
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors automatically
npm run format        # Format code with Prettier
npm run type-check    # Check TypeScript types
```

These run automatically before each commit via Husky.

### Database Management

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Create a new migration
npm run db:migrate

# Push schema without creating migration (dev only)
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with test data
npm run db:seed
```

### Working with Git

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Stage changes
git add .

# Commit (pre-commit hooks will run automatically)
git commit -m "feat: add user authentication"

# Push to remote
git push origin feature/your-feature-name
```

## IDE Setup

### VSCode (Recommended)

#### Required Extensions

Install these extensions for the best development experience:

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **Prisma** (`Prisma.prisma`)
4. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
5. **TypeScript Error Translator** (`mattpocock.ts-error-translator`)

#### VSCode Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

#### Recommended Extensions (Optional)

- GitLens (`eamodio.gitlens`)
- Error Lens (`usernamehw.errorlens`)
- Auto Rename Tag (`formulahendry.auto-rename-tag`)
- Path Intellisense (`christian-kohler.path-intellisense`)

## Cloud Integration Setup

### UploadThing (File Upload)

1. Go to https://uploadthing.com
2. Create account and app
3. Go to Dashboard → API Keys → copy the **Token** (v7 uses a single token)
4. Add to `.env`:
   ```bash
   # v7 uses a single UPLOADTHING_TOKEN (not the old UPLOADTHING_SECRET / UPLOADTHING_APP_ID)
   UPLOADTHING_TOKEN="eyJhcHBJZCI6InRlc3QiLCJhcGlLZXkiOiJza19saXZlX3h4eHh4In0="
   ```

### Google Drive Integration

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google Drive API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/integrations/google/callback`
5. Add credentials to `.env`:
   ```bash
   GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="xxxxx"
   ```

### Microsoft OneDrive Integration

1. Go to https://portal.azure.com
2. Register new application
3. Add Microsoft Graph API permissions:
   - Files.Read.All
   - Files.ReadWrite.All
   - User.Read
4. Create client secret
5. Add to `.env`:
   ```bash
   MICROSOFT_CLIENT_ID="xxxxx"
   MICROSOFT_CLIENT_SECRET="xxxxx"
   MICROSOFT_TENANT_ID="common"
   ```

## Troubleshooting

### Common Issues

#### 1. Database Connection Fails

**Error:** `Can't reach database server`

**Solution:**

- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -l`

#### 2. Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**

```bash
npm run db:generate
```

#### 3. Port 3000 Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### 4. TypeScript Errors After Dependencies Update

**Solution:**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart TypeScript server in VSCode
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### 5. Git Hooks Not Running

**Solution:**

```bash
# Reinstall Husky
npm run prepare
chmod +x .husky/pre-commit
```

### Environment-Specific Issues

#### macOS

If PostgreSQL installation fails:

```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Windows

Use WSL2 for best experience:

```bash
wsl --install
```

#### Linux

Install PostgreSQL:

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
```

## Testing Setup

### Unit Tests (Coming Soon)

```bash
npm test
npm run test:watch
npm run test:coverage
```

### E2E Tests (Coming Soon)

```bash
npm run test:e2e
```

## Debugging

### VSCode Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Database Debugging

Use Prisma Studio for visual database inspection:

```bash
npm run db:studio
```

Opens at http://localhost:5555

## Performance Monitoring

### Development Mode

Next.js automatically shows:

- Compilation time
- Bundle size
- Route performance

### Bundle Analysis

```bash
# Analyze bundle size
ANALYZE=true npm run build
```

## Additional Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project Documentation

- `README.md` - Project overview
- `docs/ARCHITECTURE.md` - Architecture details
- `docs/API.md` - API documentation (coming soon)

## Getting Help

1. Check documentation in `docs/` folder
2. Review existing issues on GitHub
3. Ask in team chat/Slack
4. Create new GitHub issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

## Next Steps

After setup is complete:

1. Read `docs/ARCHITECTURE.md` to understand project structure
2. Review `prisma/schema.prisma` to understand data models
3. Explore `lib/` folder to see business logic
4. Check `app/` folder for routes and pages
5. Start contributing!

Happy coding!
