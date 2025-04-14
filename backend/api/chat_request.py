import requests
import os
import json
from time import time
from django.conf import settings
import re

# ─────────────────────────── OpenRouter Model ─────────────────────────── #

openrouter_api_key = "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"
URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "sophosympatheia/rogue-rose-103b-v0.2:free"

def ask_gpt_openrouter(message, model=MODEL):
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

        print("🔁 Status:", response.status_code)
        print("📥 Response:", response.text)

        if response.status_code != 200:
            raise Exception(f"Error: {response.status_code} - {response.text}")

        return response.json()['choices'][0]['message']['content']

    except Exception as e:
        print("❌ OpenRouter API Error:", str(e))
        return None


# ─────────────────────────── Perplexity SONAR Model (Main Planner) ────────────────────── #

PERPLEXITY_API_KEY = "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"


def ask_gpt_sonar(prompt: str):
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "sonar",  # Powerful model for fetching real-world details
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(url, json=data, headers=headers, timeout=120)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print("❌ Perplexity API Error (SONAR):", e)
        return None


def ask_gpt_convert_to_json(text: str):
    conversion_prompt = f"""
    Convert the following detailed travel itinerary into the specified JSON format:

    ---
    {text}
    ---

    Return ONLY valid JSON in this structure:
    {{
      "summary": "Short summary of the trip.",
      "days": [
        {{
          "title": "Day 1: ...",
          "activities": [
            "08:30 - Breakfast at [place]",
            "10:00 - Visit [place] for [activity]",
            ...
          ]
        }},
        ...
      ]
    }}
    """
    return ask_gpt_openrouter(conversion_prompt)


# ─────────────────────────── Combined GPT Flow ─────────────────────────── #

def get_trip_itinerary(prompt: str):
    print("🛫 Generating Trip Prompt...")

    print("\n📤 Sending request to Perplexity (SONAR)...")
    raw_itinerary = ask_gpt_sonar(prompt)
    if not raw_itinerary:
        raise Exception("No response from Perplexity (SONAR)")

    print("\n🧠 Perplexity Response:\n")
    print(raw_itinerary[:1000], "...\n")

    print("📦 Converting to structured JSON with OpenRouter...")
    json_response = ask_gpt_convert_to_json(raw_itinerary)
    if not json_response:
        raise Exception("OpenRouter failed to convert to JSON")

    print("\n✅ Final JSON Itinerary:\n")
    print(json_response[:1000], "...\n")

    return json_response


def extract_json_from_response(response: str) -> str:
    try:
        match = re.search(r"```json\s*(\{.*?\})\s*```", response, re.DOTALL)
        if match:
            return match.group(1)
        return response.strip()  
    except Exception as e:
        print("❌ Failed to extract JSON:", e)
        return response
