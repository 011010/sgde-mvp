# Docker Configuration Files

This directory contains all Docker-related configuration files for the SGDE project.

## Directory Structure

```
docker/
├── README.md                    # This file
├── nginx/                       # Nginx reverse proxy configuration
│   ├── nginx.conf              # Main nginx configuration
│   ├── conf.d/                 # Server block configurations
│   │   └── default.conf        # Default server configuration
│   └── ssl/                    # SSL certificates directory
│       └── .gitkeep
└── postgres/                   # PostgreSQL configuration
    ├── init.sql                # Database initialization script
    └── backups/                # Database backups directory
        └── .gitkeep
```

## Nginx Configuration

### nginx.conf

Main Nginx configuration with optimizations:

- Worker processes: auto
- Worker connections: 4096
- Gzip compression enabled
- Rate limiting zones configured
- Cache zones for static files and API
- Security headers

### conf.d/default.conf

Server blocks configuration:

- HTTP server on port 80
- HTTPS server (commented, uncomment when SSL is ready)
- Static files caching (1 year)
- API rate limiting (10 req/s)
- Auth rate limiting (5 req/min)
- Health check endpoint

### ssl/

Directory for SSL certificates:

- Place `fullchain.pem` here
- Place `privkey.pem` here
- See DOCKER.md for instructions on obtaining certificates

## PostgreSQL Configuration

### init.sql

Initialization script that runs on first container start:

- Creates required extensions (uuid-ossp, pg_trgm)
- Sets optimal PostgreSQL configuration
- Configures shared buffers, cache, and work memory
- Optimizes for development/production use

### backups/

Directory for database backups:

- Automatic backups can be created with `make db-backup`
- Manual backups: `docker compose exec postgres pg_dump -U postgres sgde_dev > backup.sql`
- Restore with: `make db-restore FILE=backup.sql`

## Usage

### Development

```bash
# Start development environment (uses docker-compose.yml)
make dev

# View logs
make logs
```

### Production

```bash
# Start production environment with nginx (uses docker-compose.prod.yml)
make prod

# View logs
make prod-logs
```

### Database Operations

```bash
# Create backup
make db-backup

# Restore backup
make db-restore FILE=./docker/postgres/backups/backup_20240101.sql

# Access PostgreSQL shell
docker compose exec postgres psql -U postgres -d sgde_dev
```

## Security Considerations

1. **SSL Certificates**: Always use valid SSL certificates in production
2. **Passwords**: Change default PostgreSQL password in `.env`
3. **Secrets**: Never commit `.env` files with real secrets
4. **Network**: Backend network is isolated from internet
5. **Rate Limiting**: Configured on nginx for API and auth routes

## Performance Tuning

### PostgreSQL

Edit `init.sql` to adjust:

- `shared_buffers` - RAM for caching (default: 256MB)
- `effective_cache_size` - Hint for query planner (default: 1GB)
- `work_mem` - Memory for operations (default: 16MB)

### Nginx

Edit `nginx.conf` to adjust:

- `worker_connections` - Connections per worker (default: 4096)
- `gzip_comp_level` - Compression level 1-9 (default: 6)
- Rate limit zones in `limit_req_zone`

## Monitoring

### Check Service Health

```bash
# All services
make health

# Nginx
curl http://localhost/health

# App
curl http://localhost:3000/api/health

# PostgreSQL
docker compose exec postgres pg_isready
```

### View Logs

```bash
# All services
make logs

# Specific service
make logs-app
make logs-db

# Nginx (production only)
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Resource Usage

```bash
# Container stats
make stats

# Disk usage
docker system df
```

## Troubleshooting

### Nginx Issues

```bash
# Test nginx configuration
docker compose exec nginx nginx -t

# Reload nginx (without restart)
docker compose exec nginx nginx -s reload

# View nginx error logs
docker compose logs nginx | grep error
```

### PostgreSQL Issues

```bash
# View active connections
docker compose exec postgres psql -U postgres -d sgde_dev -c "SELECT count(*) FROM pg_stat_activity;"

# View slow queries
docker compose exec postgres psql -U postgres -d sgde_dev -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"

# Check database size
docker compose exec postgres psql -U postgres -d sgde_dev -c "SELECT pg_size_pretty(pg_database_size('sgde_dev'));"
```

## Additional Resources

- [DOCKER.md](../DOCKER.md) - Complete Docker documentation
- [DOCKER_QUICK_START.md](../DOCKER_QUICK_START.md) - Quick start guide
- [Makefile](../Makefile) - All available commands
- [nginx.org](https://nginx.org/en/docs/) - Nginx documentation
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization) - PostgreSQL tuning guide
