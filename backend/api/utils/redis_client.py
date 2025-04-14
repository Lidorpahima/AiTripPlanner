# api/utils/redis_client.py

import redis
from django.conf import settings

# יצירת לקוח Redis מה-URL שהגדרת ב-settings.py
redis_client = redis.StrictRedis.from_url(settings.REDIS_URL, decode_responses=True)
