up:
	docker compose up -d

up-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up

up-test:
	docker compose -f docker-compose.test.yml up -d

down:
	docker compose down

build:
	docker compose build

build-test:
	docker-compose -f docker-compose.test.yml build --no-cache

build-nocache:
	docker compose build --no-cache