.PHONY: help
start-infra:
	docker compose up -d
start:
	docker compose -f docker-compose.yml -f docker-compose.app.yml up -d