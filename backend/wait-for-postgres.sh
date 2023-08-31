#!/bin/bash

# Exit if any command fails
set -e

# Wait until PostgreSQL is ready
until PGPASSWORD=password psql -h "localhost" -p "5432" -U "user" -d "testdb" -c '\l'; do
  sleep 1
done

exec $cmd
