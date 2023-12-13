activate:
	export PIPENV_VENV_IN_PROJECT=true
	pipenv shell

run:
	docker-compose up -d postgres-dev
	export ENV=development && uvicorn main:app --reload --host 0.0.0.0

clean-dev:
	docker-compose stop postgres-dev
	docker-compose rm -f postgres-dev
	docker volume rm backend_pgdata

generate_requirements_txt_dev:
	pipenv requirements --dev  > requirements-dev.txt

generate_requirements_txt:
	pipenv requirements > requirements.txt

test:
	docker-compose up -d postgres-test
	export CURRENT_ENV=testing && pytest tests -s -x -vv

test-coverage:
	docker-compose up -d postgres-test
	sleep 4
	./wait-for-postgres.sh
	export CURRENT_ENV=testing && pytest tests -x -vv --cov=. --cov-report=term-missing
	docker-compose stop postgres-test
	docker-compose rm -f postgres-test

install:
	export PIPENV_VENV_IN_PROJECT=true
	pipenv install --dev

format:
	black . 

lint:
	pylint *.py