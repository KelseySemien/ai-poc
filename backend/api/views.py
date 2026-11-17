import os
import json
from pathlib import Path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from dotenv import load_dotenv

# Load .env from the backend folder (parent of api/ -> backend/)
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

@csrf_exempt
def ask_ai(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON body'}, status=400)

        user_message = data.get('message', '').strip()
        if not user_message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        try:
            client = OpenAI()
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message},
                ],
                max_tokens=200,
            )
            ai_response = response.choices[0].message.content
        except Exception as e:
            ai_response = f"AI service error: {str(e)}"

        return JsonResponse({'response': ai_response})

    return JsonResponse({'error': 'Invalid method'}, status=400)