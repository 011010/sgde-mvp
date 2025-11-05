# Quick Start Guide - SGDE

Guía rápida para levantar el proyecto en tu entorno local.

## Pre-requisitos

Asegúrate de tener instalado:

- **Node.js 18+** (https://nodejs.org/)
- **Docker Desktop** (https://www.docker.com/products/docker-desktop/) O **PostgreSQL 14+**
- **Git** (ya lo tienes)

## Opción 1: Setup con Docker (Recomendado)

### Paso 1: Clonar e Instalar

```bash
# Ya estás en el directorio del proyecto
cd /home/user/sgde-mvp

# Las dependencias ya están instaladas
# Si necesitas reinstalar:
# npm install
```

### Paso 2: Iniciar PostgreSQL con Docker

```bash
# Iniciar solo PostgreSQL
docker compose up -d postgres

# Verificar que está corriendo
docker compose ps

# Ver logs si hay problemas
docker compose logs postgres
```

### Paso 3: Configurar Base de Datos

```bash
# Generar Prisma Client
npm run db:generate

# Crear tablas (migraciones)
npm run db:migrate

# Poblar con datos iniciales
npm run db:seed
```

**Usuario Admin creado:**

- Email: `admin@sgde.local`
- Password: `Admin123!`

### Paso 4: Iniciar Aplicación

```bash
# Modo desarrollo
npm run dev
```

Abre http://localhost:3000

### Paso 5: Explorar

1. **Landing Page**: http://localhost:3000
2. **Login**: http://localhost:3000/auth/login
3. **Register**: http://localhost:3000/auth/register
4. **Dashboard**: http://localhost:3000/dashboard (requiere login)

---

## Opción 2: Setup con PostgreSQL Local

Si prefieres usar PostgreSQL instalado localmente:

### Paso 1: Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE sgde_dev;

# Salir
\q
```

### Paso 2: Actualizar .env

El archivo `.env` ya está configurado para:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sgde_dev?schema=public"
```

Si tu configuración es diferente, actualiza usuario/password/puerto.

### Paso 3: Configurar DB y Ejecutar

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

---

## Comandos Útiles

### Base de Datos

```bash
# Generar Prisma Client
npm run db:generate

# Crear migración
npm run db:migrate

# Aplicar cambios sin migración (dev)
npm run db:push

# Abrir Prisma Studio (GUI para ver datos)
npm run db:studio

# Poblar con datos de ejemplo
npm run db:seed
```

### Desarrollo

```bash
# Iniciar dev server (hot reload)
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm run start
```

### Calidad de Código

```bash
# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
npm run format:check

# Type checking
npm run type-check
```

### Docker

```bash
# Iniciar todos los servicios
docker compose up -d

# Solo PostgreSQL
docker compose up -d postgres

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (⚠️ borra datos)
docker compose down -v
```

---

## Estructura de URLs

### Públicas

- `/` - Landing page
- `/auth/login` - Login
- `/auth/register` - Registro

### Protegidas (requieren login)

- `/dashboard` - Dashboard principal
- `/dashboard/documents` - Gestión de documentos
- `/dashboard/categories` - Categorías
- `/dashboard/tags` - Tags
- `/dashboard/users` - Usuarios
- `/dashboard/settings` - Configuración

### APIs

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/signin` - Login (NextAuth)
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Crear documento
- `GET /api/documents/:id` - Ver documento
- `PATCH /api/documents/:id` - Actualizar documento
- `DELETE /api/documents/:id` - Eliminar documento

---

## Usuarios por Defecto (después del seed)

### Super Admin

- Email: `admin@sgde.local`
- Password: `Admin123!`
- Roles: Super Admin (todos los permisos)

### Crear Nuevos Usuarios

1. **Vía UI**: http://localhost:3000/auth/register
   - Por defecto obtienen rol "Student"

2. **Vía API**:

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

## Troubleshooting

### Puerto 3000 en uso

```bash
# Encontrar y matar proceso
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
PORT=3001 npm run dev
```

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
docker compose ps
# O si es local:
pg_isready -h localhost -p 5432

# Reiniciar contenedor
docker compose restart postgres

# Ver logs
docker compose logs postgres
```

### Error "Prisma Client not generated"

```bash
npm run db:generate
```

### Errores de TypeScript

```bash
# Limpiar y reinstalar
rm -rf node_modules .next
npm install
npm run db:generate
```

### Base de datos desincronizada

```bash
# Reset completo (⚠️ borra todos los datos)
npm run db:push --force-reset
npm run db:seed
```

---

## Próximos Pasos

1. **Explora el Dashboard**
   - Login con admin@sgde.local
   - Navega por las diferentes secciones

2. **Prueba las APIs**
   - Usa Postman o Thunder Client
   - Documenta en `docs/API.md`

3. **Agrega Funcionalidades**
   - Implementa las páginas pendientes (Categories, Tags, Users)
   - Conecta el upload de archivos real
   - Agrega tests

4. **Integra Cloud Services**
   - Configura Google Drive API
   - Configura Microsoft OneDrive
   - Obtén credenciales de UploadThing

---

## Configuración de Integraciones (Opcional)

### UploadThing

1. Crear cuenta: https://uploadthing.com
2. Crear app
3. Copiar API keys a `.env`:
   ```
   UPLOADTHING_SECRET="sk_live_xxxxx"
   UPLOADTHING_APP_ID="xxxxx"
   ```

### Google Drive

1. Google Cloud Console: https://console.cloud.google.com
2. Crear proyecto → Habilitar Google Drive API
3. Crear credenciales OAuth 2.0
4. Copiar a `.env`:
   ```
   GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="xxxxx"
   ```

### Microsoft OneDrive

1. Azure Portal: https://portal.azure.com
2. Registrar app → Agregar permisos Microsoft Graph
3. Copiar a `.env`:
   ```
   MICROSOFT_CLIENT_ID="xxxxx"
   MICROSOFT_CLIENT_SECRET="xxxxx"
   ```

---

## Información del Proyecto

- **Stack**: Next.js 14, TypeScript, PostgreSQL, Prisma, NextAuth.js
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Arquitectura**: Clean Architecture
- **Commits**: 3 commits principales
- **Archivos**: 79 archivos
- **Líneas de código**: ~17,000

## Soporte

- Documentación completa en `docs/`
- README principal en raíz
- API docs en `docs/API.md`
- Arquitectura en `docs/ARCHITECTURE.md`

---

**¡Listo para desarrollar! 🚀**
