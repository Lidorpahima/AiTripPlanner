import requests
import json
from django.conf import settings

openrouter_api_key = settings.OPENROUTER_API_KEY
URL = settings.MODEL_URL
MODEL = settings.MODEL

def ask_gpt(message, model=MODEL):
    try:
        response = requests.post(
            url=URL,
            headers={
                "Authorization": f"Bearer {openrouter_api_key}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": model,
                "messages": [{"role": "user", "content": message}],
            })
        )

        print("Status:", response.status_code)
        print("Response:", response.text)

        if response.status_code != 200:
            raise Exception(f"Error: {response.status_code} - {response.text}")

        return response.json()['choices'][0]['message']['content']

    except Exception as e:
        return f"❌ Error: {str(e)} ❌"
