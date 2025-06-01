#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "--- Running Django migrations ---"
python manage.py migrate --noinput

echo "--- Collecting static files ---"
# Using --clear can be helpful to remove old files before collecting new ones
python manage.py collectstatic --noinput --clear

echo "--- Starting Gunicorn ---"
# Railway provides the PORT environment variable.
# ${PORT:-8000} means: use the value of PORT if it's set, otherwise use 8000.
# You can also make workers, threads, and timeout configurable via environment variables.
GUNICORN_WORKERS=${GUNICORN_WORKERS:-3}
GUNICORN_THREADS=${GUNICORN_THREADS:-2}
GUNICORN_TIMEOUT=${GUNICORN_TIMEOUT:-60}

exec gunicorn backend.wsgi:application \
    --bind "0.0.0.0:${PORT:-8000}" \
    --workers "$GUNICORN_WORKERS" \
    --threads "$GUNICORN_THREADS" \
    --timeout "$GUNICORN_TIMEOUT" 