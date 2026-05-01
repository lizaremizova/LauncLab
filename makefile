.PHONY: up down build rebuild restart bash vite install composer migrate seed fresh logs ps init dev

DC=docker compose
PHP=$(DC) exec php
FRONTEND_DIR=/var/www/frontend/vite-project

up:
	$(DC) up -d

down:
	$(DC) down

build:
	$(DC) up -d --build

rebuild:
	$(DC) down
	$(DC) up -d --build

restart:
	$(DC) restart

clean: ## Make some clean
	-$(DC) run -e STARTUP_WAIT_FOR_SERVICES=false composer clear
	$(DC) down -v -t 5

bash:
	$(PHP) bash

vite:
	$(PHP) sh -c "cd $(FRONTEND_DIR) && npm run dev -- --host 0.0.0.0"

install:
	$(PHP) composer install
	$(PHP) sh -c "cd $(FRONTEND_DIR) && npm install"

composer:
	$(PHP) composer install

migrate:
	$(PHP) php artisan migrate

seed:
	$(PHP) php artisan db:seed

fresh:
	$(PHP) php artisan migrate:fresh --seed

logs:
	$(DC) logs -f

ps:
	$(DC) ps

init:
	$(DC) up -d --build
	@echo "⏳ Waiting for containers..."
	sleep 5
	$(PHP) composer install
	$(PHP) sh -c "cd $(FRONTEND_DIR) && npm install"
	$(PHP) php artisan optimize:clear
	$(PHP) php artisan migrate --seed
	@echo "✅ Project ready!"

dev:
	$(DC) up -d --build
	@echo "⏳ Waiting for DB..."
	sleep 5
	$(PHP) php artisan optimize:clear
	$(PHP) php artisan migrate --force
	@echo "🚀 Starting Vite..."
	$(PHP) sh -c "cd $(FRONTEND_DIR) && npm run dev -- --host 0.0.0.0"

#make db-query q="SELECT * FROM users;"
db-query:
	docker compose exec db mysql -u user -ppassword launchlab -e "$(q)"

link:
	$(PHP) php artisan storage:link
