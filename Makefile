# SGDE Project Makefile - Simplified Docker Operations

.PHONY: help dev prod build up down restart logs clean db-migrate db-seed test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	docker compose up -d

dev-build: ## Build and start development environment
	docker compose up -d --build

prod: ## Start production environment
	docker compose -f docker-compose.prod.yml up -d

prod-build: ## Build and start production environment
	docker compose -f docker-compose.prod.yml up -d --build

build: ## Build Docker images
	docker compose build

up: ## Start all services
	docker compose up -d

down: ## Stop all services
	docker compose down

restart: ## Restart all services
	docker compose restart

logs: ## Show logs from all services
	docker compose logs -f

logs-app: ## Show logs from app service only
	docker compose logs -f app

logs-db: ## Show logs from database service only
	docker compose logs -f postgres

clean: ## Remove all containers, volumes, and images
	docker compose down -v --remove-orphans
	docker system prune -af

db-migrate: ## Run database migrations
	docker compose exec app npx prisma migrate deploy

db-seed: ## Seed the database
	docker compose exec app npx prisma db seed

db-studio: ## Open Prisma Studio
	docker compose exec app npx prisma studio

db-backup: ## Create database backup
	@echo "Creating database backup..."
	docker compose exec postgres pg_dump -U postgres sgde_dev > ./docker/postgres/backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created successfully!"

db-restore: ## Restore database from latest backup (use FILE=filename to specify)
	@echo "Restoring database from backup..."
	docker compose exec -T postgres psql -U postgres sgde_dev < $(FILE)
	@echo "Database restored successfully!"

test: ## Run tests
	docker compose exec app npm test

shell: ## Open shell in app container
	docker compose exec app sh

stats: ## Show container resource usage
	docker stats

health: ## Check health of all services
	docker compose ps

size: ## Show Docker image sizes
	docker images | grep sgde

# Production specific commands
prod-logs: ## Show production logs
	docker compose -f docker-compose.prod.yml logs -f

prod-down: ## Stop production environment
	docker compose -f docker-compose.prod.yml down

prod-restart: ## Restart production environment
	docker compose -f docker-compose.prod.yml restart

prod-clean: ## Clean production environment
	docker compose -f docker-compose.prod.yml down -v --remove-orphans
