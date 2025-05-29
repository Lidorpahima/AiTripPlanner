# backend/Dockerfile.prod
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=backend.settings
ENV DJANGO_ENV=production

RUN useradd -m appuser

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create wait-for-db script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
host="$1"\n\
shift\n\
cmd="$@"\n\
\n\
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "$host" -U "postgres" -c "\q"; do\n\
  >&2 echo "Postgres is unavailable - sleeping"\n\
  sleep 1\n\
done\n\
\n\
>&2 echo "Postgres is up - executing command"\n\
exec $cmd' > /app/wait-for-db.sh

RUN chmod +x /app/wait-for-db.sh

RUN chown -R appuser:appuser /app

USER appuser

ARG DJANGO_SECRET_KEY="dummy_secret_key_for_build"
ENV DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY}

ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DATABASE_URL=${DATABASE_URL}

RUN python manage.py collectstatic --noinput --clear

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Wait for database\n\
./wait-for-db.sh postgres.railway.internal\n\
\n\
# Run migrations\n\
python manage.py migrate\n\
\n\
# Start Gunicorn\n\
exec gunicorn --bind 0.0.0.0:8000 --workers 3 backend.wsgi:application' > /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

CMD ["/app/entrypoint.sh"]