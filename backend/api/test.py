import os
import requests
import json

# קח את המפתח מהסביבה
PERPLEXITY_API_KEY = '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'

# פונקציית השליחה למודל Perplexity
def ask_gpt(prompt: str):
    url = "https://api.perplexity.ai/chat/completions"
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "sonar",  # דגם מהיר וזול
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    }
    try:
        print("📤 Sending request to Perplexity...")
        response = requests.post(url, json=data, headers=headers, timeout=60)
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        print("🧠 Perplexity Response:\n")
        print(content)
        return content
    except Exception as e:
        print("❌ Perplexity API Error:", e)
        return None

# פונקציה שמחזירה אירועים אמיתיים
def fetch_real_events(destination: str, start_date: str, end_date: str) -> str:
    prompt = f"What are the top events in {destination} between {start_date} and {end_date}?"
    return ask_gpt(prompt)

# בניית פרומפט לטיול עם שילוב אירועים אמיתיים

def generate_trip_prompt(form_data: dict) -> str:
    destination = form_data.get("destination", "a destination")
    start_date = form_data.get("startDate", "a start date")
    end_date = form_data.get("endDate", "an end date")
    audience = "a traveler"
    interests = ', '.join(form_data.get("interests", [])) or "general travel interests"
    trip_style = ', '.join(form_data.get("tripStyle", [])) or "standard"
    pace = form_data.get("pace", "moderate")

    real_events = fetch_real_events(destination, start_date, end_date)

    prompt = f"""
You are an expert travel planner.

Your task is to generate a **detailed** travel itinerary based on the provided information.

**Important:**
- DO NOT ask the user for anything.
- Assume you have all the information you need.
- Return ONLY JSON (no explanation).
- Include **exact times** (e.g., 08:30, 14:00) for each activity.
- Use **real names of places**, landmarks, and restaurants.
- Include **options** or alternatives where relevant (e.g., rainy-day options).
- Suggest specific restaurants or cafes when possible.

**Real-world Events in {destination} ({start_date} - {end_date}):**
{real_events}

**Response Format (JSON only):**
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

**Trip Info:**
- Destination: {destination}
- Dates: {start_date} to {end_date}
- Style: {trip_style}
- Interests: {interests}
- Audience: {audience}
- Pace: {pace}
"""
    return prompt.strip()

# הרצה לדוגמה
if __name__ == "__main__":
    form_data = {
        "destination": "Paris",
        "startDate": "2025-04-16",
        "endDate": "2025-04-18",
        "interests": ["Art", "Food"],
        "tripStyle": ["Romantic", "Luxury"],
        "pace": "Relaxed"
    }

    print("\n🛫 Generating Trip Prompt...\n")
    full_prompt = generate_trip_prompt(form_data)

    print("\n======================= PROMPT SENT TO GPT =======================\n")
    print(full_prompt)

    print("\n======================= GPT RESPONSE ============================\n")
    final_response = ask_gpt(full_prompt)