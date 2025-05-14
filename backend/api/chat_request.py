import requests
import os
import json
from django.conf import settings
import re
import traceback 
import google.generativeai as genai

# ─────────────────────────── Environment Variables / Settings ─────────────────────────── #

api_key = settings.GOOGLE_AI_API_KEY
# --------------------------------------------------

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


model_name = 'gemini-2.5-pro-exp-03-25'
print(f"Using model: {model_name}")


# ─────────────────────────── GEMINI Model Function ─────────────────────────── #
def ask_gemini(prompt: str, model_to_use: str) -> str | None:
    """Sends a prompt to the specified Gemini model and returns the text response."""
    print(f"\n🤖 Sending prompt to model: {model_to_use}...")
    try:
        model = genai.GenerativeModel(model_to_use)
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]
        response = model.generate_content(prompt, safety_settings=safety_settings)


        prompt_feedback = getattr(response, 'prompt_feedback', None)
        if prompt_feedback and getattr(prompt_feedback, 'block_reason', None):
             block_reason_value = getattr(prompt_feedback, 'block_reason', 'UNKNOWN')
             reason_name = getattr(block_reason_value, 'name', str(block_reason_value))
             print(f"⚠️ Prompt blocked: {reason_name}")
             safety_ratings = getattr(prompt_feedback, 'safety_ratings', [])
             if safety_ratings:
                  print(f"   Safety Ratings (Prompt): {safety_ratings}")
             return None

        if not response.candidates:
            print("⚠️ No candidates returned in the response.")

            if hasattr(response, 'text') and response.text:
                 print("   ℹ️ Found text directly on response object.")
                 return response.text
            return None

        candidate = response.candidates[0]
        finish_reason_value = getattr(candidate, 'finish_reason', None) 

        if finish_reason_value == 1: 
            content = getattr(candidate, 'content', None)
            parts = getattr(content, 'parts', []) if content else []

            if parts:
                full_text = "".join(part.text for part in parts if hasattr(part, 'text'))
                print("   ✅ Model finished normally (STOP) and returned content.")
                return full_text
            else:
                print("   ⚠️ Model finished normally (STOP) but returned no content parts.")
                safety_ratings = getattr(candidate, 'safety_ratings', [])
                if safety_ratings:
                    print(f"   Safety Ratings (Response): {safety_ratings}")
                if finish_reason_value == 4: 
                     print("   Reason details: FINISH_REASON_RECITATION")
                return "" 

        else:
            reason_name = "UNKNOWN"
            if finish_reason_value is not None:
                 reason_name = getattr(genai.types.FinishReason(finish_reason_value), 'name', str(finish_reason_value))

            print(f"⚠️ Model finished for reason: {reason_name} (Value: {finish_reason_value})")

            safety_ratings = getattr(candidate, 'safety_ratings', [])
            if safety_ratings:
                print(f"   Safety Ratings (Response): {safety_ratings}")

            if finish_reason_value == 2: 
                 print("   Reason details: FINISH_REASON_SAFETY")
            elif finish_reason_value == 4:
                 print("   Reason details: FINISH_REASON_RECITATION")
            elif finish_reason_value == 3:
                 print("   Reason details: FINISH_REASON_MAX_TOKENS")


            return None 
        # --- END OF CORRECTED FINISH REASON LOGIC ---

    except AttributeError as ae:
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


# ─────────────────────────── JSON Extraction Utility ─────────────────────────── #

def extract_json_from_response(response: str | None) -> str:
    if not response:
        return ""

    response = response.strip()

    match_block = re.search(r"```json\s*(\{.*?\})\s*```", response, re.DOTALL | re.IGNORECASE)
    if match_block:
        potential_json = match_block.group(1).strip()
        try:
            json.loads(potential_json)
            print("ℹ️ Extracted JSON using ```json block.")
            return potential_json
        except json.JSONDecodeError:
            print("⚠️ Found ```json block, but content is not valid JSON.")

    first_brace = response.find('{')
    last_brace = response.rfind('}')

    if first_brace != -1 and last_brace != -1 and last_brace >= first_brace:
        potential_json = response[first_brace:last_brace+1].strip()
        try:
            json.loads(potential_json)
            print("ℹ️ Extracted JSON using first '{' and last '}'.")
            return potential_json
        except json.JSONDecodeError:
             print(f"⚠️ Found '{{...}}' block, but content is not valid JSON (length {len(potential_json)}).")

    print("⚠️ Could not find specific JSON block, returning the stripped raw response as potential JSON.")
    return response 