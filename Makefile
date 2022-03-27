up:
	docker compose up -d

up-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up

down:
	docker compose down

build:
	docker compose build

build-nocache:
	docker compose build --no-cache