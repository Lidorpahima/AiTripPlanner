# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# !! אזהרת אבטחה חמורה !!
# !! אתה משתמש במפתח API ישירות בקוד. זה מאוד לא בטוח! !!
# !! כל מי שרואה את הקוד הזה יכול להשתמש במפתח שלך.       !!
# !! מחק/החלף מפתח זה מיד לאחר הניסוי.                   !!
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import traceback 
import google.generativeai as genai
import os
import time
import json
import re # נייבא re לצורך ניקוי JSON

# 1. הגדרות ראשוניות
# --------------------------------------------------
# --- שימוש במפתח API ישירות בקוד (לא מומלץ!!!) ---
api_key = "AIzaSyBt2HFWcp74Fku9WHZAVIB-m34fWbexlDc"
# --------------------------------------------------

# בדיקה בסיסית אם המשתנה לא ריק (למקרה שההדבקה נכשלה)
if not api_key:
    print("ERROR: API key string is empty.")
    exit()

try:
    genai.configure(api_key=api_key)
    print("API Key configured.")
except Exception as config_error:
    print(f"ERROR configuring API key: {config_error}")
    print("Please ensure the API key is valid.")
    exit()


# בחר את המודל לבדיקה
model_name = 'gemini-2.5-pro-exp-03-25'
print(f"Using model: {model_name}")

# נתוני קלט לדוגמה
form_data = {
    "destination": "Kyoto, Japan",
    "startDate": "2025-10-20",
    "endDate": "2025-10-22", # טיול של 3 ימים
    "interests": ["Temples", "Gardens", "Traditional Food", "Geisha district"],
    "tripStyle": ["Cultural Immersion", "Relaxed"],
    "pace": "moderate" # קצב בינוני
}
print(f"Planning trip for: {form_data.get('destination')}")

# 2. פונקציות עזר
# --------------------------------------------------

def ask_gemini(prompt: str, model_to_use: str) -> str | None:
    """Sends a prompt to the specified Gemini model and returns the text response."""
    print(f"\n🤖 Sending prompt to model: {model_to_use}...")
    start_call_time = time.time()
    try:
        model = genai.GenerativeModel(model_to_use)
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]
        response = model.generate_content(prompt, safety_settings=safety_settings)
        end_call_time = time.time()
        print(f"   API call duration: {end_call_time - start_call_time:.2f}s")

        # 1. Check if prompt itself was blocked
        # שימוש ב-getattr לגישה בטוחה למקרה שהמבנה שונה במקצת
        prompt_feedback = getattr(response, 'prompt_feedback', None)
        if prompt_feedback and getattr(prompt_feedback, 'block_reason', None):
             block_reason_value = getattr(prompt_feedback, 'block_reason', 'UNKNOWN')
             reason_name = getattr(block_reason_value, 'name', str(block_reason_value))
             print(f"⚠️ Prompt blocked: {reason_name}")
             safety_ratings = getattr(prompt_feedback, 'safety_ratings', [])
             if safety_ratings:
                  print(f"   Safety Ratings (Prompt): {safety_ratings}")
             return None

        # 2. Check if there are any response candidates
        if not response.candidates:
            print("⚠️ No candidates returned in the response.")
            # לפעמים אין candidates אבל יש טקסט ישיר (פחות נפוץ ב-API החדש)
            # נבדוק אם יש טקסט ישיר כתכונה של response
            if hasattr(response, 'text') and response.text:
                 print("   ℹ️ Found text directly on response object.")
                 return response.text
            return None # אין תשובה

        # 3. Process the first candidate (most common case)
        candidate = response.candidates[0]
        finish_reason_value = getattr(candidate, 'finish_reason', None) # גישה בטוחה

        # --- START OF CORRECTED FINISH REASON LOGIC ---
        # Check if the finish reason is STOP (usually value 1)
        if finish_reason_value == 1: # 1 typically means FINISH_REASON_STOP
            # It stopped normally, now check if there's content
            content = getattr(candidate, 'content', None)
            parts = getattr(content, 'parts', []) if content else []

            if parts:
                # Extract text from parts
                full_text = "".join(part.text for part in parts if hasattr(part, 'text'))
                print("   ✅ Model finished normally (STOP) and returned content.")
                return full_text
            else:
                # Stopped normally but no content (likely safety filtered or maybe recitation)
                print("   ⚠️ Model finished normally (STOP) but returned no content parts.")
                safety_ratings = getattr(candidate, 'safety_ratings', [])
                if safety_ratings:
                    print(f"   Safety Ratings (Response): {safety_ratings}")
                # אם הסיבה היא RECITATION, גם אז לא יהיה תוכן
                if finish_reason_value == 4: # 4 = FINISH_REASON_RECITATION
                     print("   Reason details: FINISH_REASON_RECITATION")
                return "" # Return empty string for empty but successful stop

        else:
            # Finished for another reason (SAFETY, MAX_TOKENS, RECITATION, OTHER, UNKNOWN/None)
            reason_name = "UNKNOWN"
            if finish_reason_value is not None:
                 # נסה לקבל את השם של ה-enum אם הוא קיים, אחרת את הערך המספרי
                 reason_name = getattr(genai.types.FinishReason(finish_reason_value), 'name', str(finish_reason_value))

            print(f"⚠️ Model finished for reason: {reason_name} (Value: {finish_reason_value})")

            safety_ratings = getattr(candidate, 'safety_ratings', [])
            if safety_ratings:
                print(f"   Safety Ratings (Response): {safety_ratings}")

            # אם הסיבה היא SAFETY (ערך 2) או RECITATION (ערך 4), נציין זאת במפורש
            if finish_reason_value == 2: # 2 = FINISH_REASON_SAFETY
                 print("   Reason details: FINISH_REASON_SAFETY")
            elif finish_reason_value == 4: # 4 = FINISH_REASON_RECITATION
                 print("   Reason details: FINISH_REASON_RECITATION")
            elif finish_reason_value == 3: # 3 = FINISH_REASON_MAX_TOKENS
                 print("   Reason details: FINISH_REASON_MAX_TOKENS")


            return None # Indicate failure or non-standard stop
        # --- END OF CORRECTED FINISH REASON LOGIC ---

    except AttributeError as ae:
         # Specific check for the error we are seeing
         print(f"❌ AttributeError during Gemini API processing: {ae}")
         print(f"   This often means an incompatibility between the code and the installed library version regarding response structure.")
         print("Traceback:")
         traceback.print_exc()
         return None
    except Exception as e:
        print(f"❌ Unexpected error during Gemini API call: {e}")
        print("Traceback:")
        traceback.print_exc()
        return None


# 3. יצירת הפרומפט המאוחד (פונקציה)
# --------------------------------------------------

def generate_single_combined_prompt(form_data: dict) -> str:
    """Creates a single prompt that asks the model to research AND structure."""
    destination = form_data.get("destination", "a destination")
    start_date = form_data.get("startDate", "a start date")
    end_date = form_data.get("endDate", "an end date")
    interests_list = form_data.get("interests", [])
    interests = ', '.join(interests_list) or "general travel interests"
    trip_style = ', '.join(form_data.get("tripStyle", [])) or "standard"
    pace = form_data.get("pace", "moderate")
    date_range_str = f"from {start_date} to {end_date}" if start_date != end_date else f"on {start_date}"

    # --- הפרומפט עצמו ---
    prompt = f"""
You are an expert travel planner and researcher with internet access. Your single task is to directly create a detailed JSON itinerary based on the user's request below, performing the necessary research implicitly.

**User Preferences:**
- Destination: {destination}
- Dates: {date_range_str}
- Traveler Interests: {interests}
- Trip Style: {trip_style}
- Pace: {pace}

**Your Combined Task & Output Requirements:**
1.  **Implicitly Research:** Based *only* on the preferences above, identify key attractions, activities, relevant food/cafe types/locations, and any specific real-world events (concerts, festivals, etc.) occurring in {destination} between {start_date} and {end_date} that align with the traveler's interests ({interests}) and style ({trip_style}). Use your knowledge and search capabilities.
2.  **Directly Create JSON Itinerary:** Use the information gathered (implicitly) to construct a day-by-day travel itinerary.
3.  **Strict Output Format:** Format the *entire* output **strictly** as a single JSON object adhering precisely to the format specified below. **ABSOLUTELY NO TEXT BEFORE OR AFTER THE JSON OBJECT.** The JSON should be the only thing in your response.
4.  **Activity Object Details:** For each activity in the JSON, include:
    *   `time`: Exact start time (HH:MM).
    *   `description`: User-friendly description, using specific names of places/events found during your internal research (e.g., "Visit Kinkaku-ji (Golden Pavilion)", "Lunch exploring Nishiki Market", "Evening stroll in Gion district").
    *   `place_name_for_lookup`: The specific, searchable name of the physical location (e.g., "Kinkaku-ji", "Nishiki Market", "Gion Corner", "Fushimi Inari Shrine"). Set to `null` or `""` for general activities (hotel breakfast, neighborhood strolls, exploring large areas without a single point like "Arashiyama Bamboo Grove").
5.  **Event Integration:** If your research finds relevant events, integrate them logically into the schedule within the JSON structure, ensuring `description` mentions the event and `place_name_for_lookup` is the venue.
6.  **Pace Adherence:** Ensure the number of activities per day reflects the requested pace ('{pace}').
7.  **Summary:** Include a short `summary` field within the JSON.
8.  **CRITICAL OUTPUT CONSTRAINT:** Output **ONLY the raw JSON object**. Start with `{{` and end with `}}`. No explanations, no apologies, no markdown formatting, no introductory sentences like "Here is the JSON itinerary:".

**Required JSON Output Format:**
```json
{{
  "summary": "A short, engaging summary of the planned trip to {destination}.",
  "days": [
    {{
      "title": "Day 1: [Meaningful Title Reflecting Activities]",
      "activities": [
        {{
          "time": "HH:MM",
          "description": "Specific activity description based on research",
          "place_name_for_lookup": "Specific Place Name or null/empty"
        }}
        // ... more activities for Day 1 based on pace ...
      ]
    }},
    // ... objects for Day 2, Day 3 etc. up to {end_date} ...
  ]
}}Now, generate ONLY the JSON itinerary based on the user preferences and your research.
"""
    return prompt.strip()
# 4. הרצת התהליך המאוחד - ***בתוך בלוק if __name__ == "__main__":***
# ... (כל הקוד שלפני נשאר זהה) ...

# 4. הרצת התהליך המאוחד - ***בתוך בלוק if __name__ == "__main__":***
# --------------------------------------------------------------------
if __name__ == "__main__":  # <-- תיקון 1: שינוי ל-__name__
    # <-- תיקון 2: כל הבלוק הבא מוזח פנימה -->
    print("\n--- Running Single-Step Combined Research & Structuring Test ---")
    single_prompt = generate_single_combined_prompt(form_data)
    print(f"   Generated prompt (length: {len(single_prompt)} chars)")

    start_time = time.time()
    raw_response = ask_gemini(single_prompt, model_name)
    end_time = time.time()

    total_duration = end_time - start_time
    print(f"\n⏱️ Total API Response Time (Single Prompt): {total_duration:.2f} seconds")

    if raw_response is None:
        print("\n❌ Failed to get a valid response from the model (API error or blocked). Exiting.")
        exit()
    elif raw_response == "":
         print("\n⚠️ Received an empty response from the model. Cannot proceed.")
         exit()
    else:
         print(f"   Received response (length: {len(raw_response)} chars)")

    print("\n--- JSON Cleaning and Parsing ---")
    cleaned_json_str = extract_json_from_response(raw_response)

    if not cleaned_json_str or not cleaned_json_str.strip().startswith('{'):
        print("❌ Failed to extract valid JSON content from the response after cleaning.")
        print("\nRaw response received was:")
        print(raw_response)
        exit()

    try:
        parsed_result = json.loads(cleaned_json_str)
        print("\n✅ Successfully parsed the JSON itinerary!")
        print("\n📅 Final Parsed Itinerary:")
        print(json.dumps(parsed_result, indent=2, ensure_ascii=False))

    except json.JSONDecodeError as e:
        print(f"\n❌ JSON Decode Error – The cleaned response was not valid JSON: {e}")
        print("\nProblematic Cleaned String trying to parse:")
        print(cleaned_json_str)

    print("\n--- Test Complete ---")

# <-- סוף הבלוק המוזח -->