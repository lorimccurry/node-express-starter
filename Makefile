up:
	docker compose up -d

up-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up

up-with-test:
	docker compose -f docker-compose.yml -f docker-compose.test.yml up -d

down:
	docker compose down

build:
	bash clean_pgdata.sh && docker compose build

build-nocache:
	bash clean_pgdata.sh && docker compose build --no-cache