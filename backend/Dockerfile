# Build stage
FROM python:3.11-slim as builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH=/opt/venv/bin:$PATH

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    rm -rf /root/.cache/pip/*

# Final stage
FROM python:3.11-slim

# Copy virtual env from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH=/opt/venv/bin:$PATH

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=backend.settings

WORKDIR /app
COPY . .

# Create startup script with proper PORT handling
RUN printf "#!/bin/bash\n" > ./django_runner.sh && \
    printf "set -e\n\n" >> ./django_runner.sh && \
    printf "RUN_PORT=\"\${PORT:-8000}\"\n\n" >> ./django_runner.sh && \
    printf "echo \"Starting on port: \$RUN_PORT\"\n\n" >> ./django_runner.sh && \
    printf "python manage.py migrate --no-input\n" >> ./django_runner.sh && \
    printf "python manage.py collectstatic --no-input\n" >> ./django_runner.sh && \
    printf "gunicorn backend.wsgi:application --bind \"0.0.0.0:\$RUN_PORT\" --workers 3 --timeout 120\n" >> ./django_runner.sh

# Setup non-root user
RUN useradd -r appuser && \
    chown -R appuser:appuser /app && \
    chown -R appuser:appuser /opt/venv && \
    chmod +x django_runner.sh

USER appuser

CMD ["./django_runner.sh"]
