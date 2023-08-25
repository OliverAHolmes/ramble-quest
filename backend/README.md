# Backend

This directory contains the backend for the application. It is a [FastAPI](https://fastapi.tiangolo.com/) application
using [SQLAlchemy](https://docs.sqlalchemy.org/en/20/) for working with an in-memory SQLite DB.

## Prerequisites

The following are must be installed to run the backend:

- Python 3.11
- virtualenv

## Project Commands

### 1. **Project in Development Mode:**

### 2. **Run the Project in Development Mode:**

To start the Uvicorn server in development mode:

```bash
make run
```

This command sets the environment to `development` and runs:

```bash
export ENV=development && uvicorn main:app --reload --host 0.0.0.0
```

### 3. **Clean and Run in Development Mode:**

This command deletes the `database.db` file and then starts the Uvicorn server in development mode:

```bash
make clean-run
```

Executed commands:

```bash
export ENV=development && rm -f database.db && uvicorn main:app --reload --host 0.0.0.0
```

### 4. **Generate Requirements.txt:**

To produce a `requirements.txt` file from the Pipenv environment:

```bash
make generate_requirements_txt
```

The command used is:

```bash
pipenv requirements --dev > requirements.txt
```

### 5. **Run Tests:**

For testing:

```bash
make test
```

This command deletes the `test.db`, sets the environment to `testing`, and then runs pytest:

```bash
rm -f test.db
export ENV=testing && pytest tests -x -vv
```

### 6. **Get Test Coverage :**

For testing:

```bash
make test-coverage
```

This command deletes the `test.db`, sets the environment to `testing`, and then gets the test coverage of the project:

```bash
rm -f test.db
export ENV=testing && pytest tests -x -vv --cov=. --cov-report=term-missing
```

### 7. **Install Project Dependencies:**

To set up the project's dependencies:

```bash
make install
```

This corresponds to:

```bash
pipenv install --dev
```

