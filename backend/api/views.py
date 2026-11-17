import os
import json
from pathlib import Path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from dotenv import load_dotenv

# Load .env from the backend folder (where manage.py lives)
BASE_DIR = Path(__file__).resolve().parent.parent  # goes up from api/ to backend/
load_dotenv(BASE_DIR / ".env")

@csrf_exempt
def ask_ai(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data.get('message', '')
        
        try:
            client = OpenAI()  # reads OPENAI_API_KEY from environment
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=200
            )
            ai_response = response.choices[0].message.content
        except Exception as e:
            ai_response = f"AI service error: {str(e)}"
            
        return JsonResponse({'response': ai_response})
    return JsonResponse({'error': 'Invalid method'}, status=400)