#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

echo "--- Environment Variables ---"
printenv 
echo "--- Value of PORT variable: [${PORT}] ---"
echo "--- Defaulted PORT for Gunicorn: [${PORT:-8000}] ---"

echo "--- Running Django migrations ---"
python manage.py migrate --noinput

echo "--- Collecting static files ---"
python manage.py collectstatic --noinput --clear

echo "--- Starting Gunicorn ---"
GUNICORN_WORKERS=${GUNICORN_WORKERS:-3}
GUNICORN_THREADS=${GUNICORN_THREADS:-2}
GUNICORN_TIMEOUT=${GUNICORN_TIMEOUT:-60}

echo "Gunicorn command to be executed: exec gunicorn backend.wsgi:application --bind \"0.0.0.0:${PORT:-8000}\" --workers \"$GUNICORN_WORKERS\" --threads \"$GUNICORN_THREADS\" --timeout \"$GUNICORN_TIMEOUT\""

exec gunicorn backend.wsgi:application \
    --bind "0.0.0.0:8000" \
    --workers "$GUNICORN_WORKERS" \
    --threads "$GUNICORN_THREADS" \
    --timeout "$GUNICORN_TIMEOUT"