FROM python:3.11-slim


WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000", "--reload"]
