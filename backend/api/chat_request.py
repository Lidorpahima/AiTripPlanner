import requests
import os
import json
from time import time
from django.conf import settings
import re

# ─────────────────────────── Environment Variables / Settings ─────────────────────────── #

# מפתחות API
openrouter_api_key = "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"
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

# כתובות URL של ה-API
URL_OPENROUTER = os.getenv("OPENROUTER_URL", "https://openrouter.ai/api/v1/chat/completions")
URL_PERPLEXITY = os.getenv("PERPLEXITY_URL", "https://api.perplexity.ai/chat/completions")

# מודלים
MODEL_OPENROUTER = os.getenv("OPENROUTER_MODEL", "sophosympatheia/rogue-rose-103b-v0.2:free") # או המודל החינמי שבחרת
MODEL_SONAR = "sonar" # או "sonar-small-online" למהירות/עלות נמוכה יותר אם נתמך ומתאים

# Timeout לבקשות רשת (בשניות)
REQUEST_TIMEOUT = 120

if not openrouter_api_key:
    print("⚠️ Warning: OPENROUTER_API_KEY environment variable not set.")
if not PERPLEXITY_API_KEY:
    print("⚠️ Warning: PERPLEXITY_API_KEY environment variable not set.")


# ─────────────────────────── OpenRouter Model Function ─────────────────────────── #

def ask_gpt_openrouter(message: str, model: str = MODEL_OPENROUTER) -> str | None:
    """Sends a prompt to the specified OpenRouter model and returns the text response."""
    if not openrouter_api_key:
        print("❌ OpenRouter API Key is missing. Cannot make the request.")
        return None

    headers = {
        "Authorization": f"Bearer {openrouter_api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": settings.SITE_URL if hasattr(settings, 'SITE_URL') else "",
        "X-Title": settings.SITE_NAME if hasattr(settings, 'SITE_NAME') else "",
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": message}],

    }

    try:
        response = requests.post(
            url=URL_OPENROUTER,
            headers=headers,
            data=json.dumps(data),
            timeout=REQUEST_TIMEOUT
        )

        print(f"🔁 OpenRouter Status Code: {response.status_code}")

        # בדוק אם הבקשה הצליחה
        response.raise_for_status() # יזרוק שגיאה עבור 4xx/5xx

        response_json = response.json()

        if 'choices' in response_json and len(response_json['choices']) > 0:
            content = response_json['choices'][0].get('message', {}).get('content')
            if content:
                return content.strip()
            else:
                print("❌ OpenRouter response missing content.")
                return None
        else:
            print("❌ OpenRouter response missing choices.")
            print("📥 Response Body:", response.text) # הדפס את גוף התשובה לדיבוג
            return None

    except requests.exceptions.Timeout:
        print(f"❌ OpenRouter API Error: Request timed out after {REQUEST_TIMEOUT} seconds.")
        return None
    except requests.exceptions.RequestException as e:
        # שגיאות רשת, שגיאות סטטוס (4xx, 5xx)
        print(f"❌ OpenRouter API Error: {e}")

        if hasattr(e, 'response') and e.response is not None:
            print(f"📥 Response Body: {e.response.text}")
        return None
    except Exception as e:
        # שגיאות לא צפויות אחרות (למשל, עיבוד JSON)
        print(f"❌ Unexpected error in ask_gpt_openrouter: {e}")
        return None


# ─────────────────── Perplexity SONAR Model Function (for Research) ─────────────────── #

def ask_gpt_sonar(prompt: str, model: str = MODEL_SONAR) -> str | None:
    """Sends a prompt to the Perplexity SONAR model and returns the text response."""
    if not PERPLEXITY_API_KEY:
        print("❌ Perplexity API Key is missing. Cannot make the request.")
        return None

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a helpful travel research assistant. Provide concise and relevant information based on the user's request."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(
            url=URL_PERPLEXITY,
            json=data,
            headers=headers,
            timeout=REQUEST_TIMEOUT
        )
        print(f"🔁 Perplexity Status Code: {response.status_code}")
        response.raise_for_status() # זרוק שגיאה עבור 4xx/5xx

        response_json = response.json()

        if 'choices' in response_json and len(response_json['choices']) > 0:
            content = response_json['choices'][0].get('message', {}).get('content')
            if content:
                return content.strip()
            else:
                print("❌ Perplexity response missing content.")
                return None
        else:
            print("❌ Perplexity response missing choices.")
            print("📥 Response Body:", response.text)
            return None

    except requests.exceptions.Timeout:
        print(f"❌ Perplexity API Error: Request timed out after {REQUEST_TIMEOUT} seconds.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Perplexity API Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"📥 Response Body: {e.response.text}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error in ask_gpt_sonar: {e}")
        return None


# ─────────────────────────── JSON Extraction Utility ─────────────────────────── #

def extract_json_from_response(response: str | None) -> str:
    if not response:
        return ""

    response = response.strip()

    match_block = re.search(r"```json\s*(\{.*?\})\s*```", response, re.DOTALL | re.IGNORECASE)
    if match_block:
        potential_json = match_block.group(1).strip()
        # ודא שזה באמת JSON תקין לפני שמחזירים
        try:
            json.loads(potential_json)
            print("ℹ️ Extracted JSON using ```json block.")
            return potential_json
        except json.JSONDecodeError:
            print("⚠️ Found ```json block, but content is not valid JSON.")
            # המשך לנסות שיטות אחרות

    # 2. נסה למצוא את ה-JSON הראשון והאחרון שמתחיל ב'{' ומסתיים ב'}'
    first_brace = response.find('{')
    last_brace = response.rfind('}')

    if first_brace != -1 and last_brace != -1 and last_brace >= first_brace:
        potential_json = response[first_brace:last_brace+1].strip()
        try:
            # נסה לטעון את החלק הזה כ-JSON
            json.loads(potential_json)
            print("ℹ️ Extracted JSON using first '{' and last '}'.")
            return potential_json
        except json.JSONDecodeError:
             print(f"⚠️ Found '{{...}}' block, but content is not valid JSON (length {len(potential_json)}).")

    print("⚠️ Could not find specific JSON block, returning the stripped raw response as potential JSON.")
    return response # החזר את התגובה המקורית (לאחר strip) בתקווה שהיא ה-JSON