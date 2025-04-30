
import redis
from django.conf import settings

redis_client = redis.StrictRedis.from_url(settings.REDIS_URL, decode_responses=True)
