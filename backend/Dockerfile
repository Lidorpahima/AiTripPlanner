FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN useradd -m appuser
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R appuser:appuser /app

USER appuser

CMD ["echo", "Ready for Railway to run Procfile"]
