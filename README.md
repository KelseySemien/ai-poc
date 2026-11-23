AI PoC — React + Django + OpenAI

A full-stack proof-of-concept showing how to integrate a large language model into an existing web workflow. A React frontend accepts a user prompt and sends it to a Django API, and the backend calls the OpenAI Chat Completions API and returns a model-generated response.

Built as a demonstration piece for the Associate AI Developer role at St. Onge Company.

Live Demo

Frontend (share this link): https://ai-poc-eosin.vercel.app

Note: The backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after a period of dormancy can take up to a minute to wake. This is expected behavior for free-tier hosting and does not mean the application is broken.

<!-- Add a screenshot or short GIF of the chat interface here, e.g. ![Chat interface](docs/screenshot.png) -->
Tech Stack
Layer	Technology
Frontend	React, Vite
Backend	Django, django-cors-headers, gunicorn
AI	OpenAI Python SDK, gpt-4o-mini (chosen for low cost and fast responses)
Hosting	Vercel (frontend), Render (backend)
What This Project Demonstrates
A working full-stack integration from a modern React frontend, through a Python Django backend, to an external AI service
Secure handling of API credentials through environment variables, with the key never committed to source control
Correct cross-origin resource sharing (CORS) configuration between separately hosted frontend and backend services
A realistic deployment on free-tier cloud infrastructure, which is how many small teams prototype
Project Structure
.
├── frontend/          # React application (Vite)
│   ├── src/           # React components
│   ├── vite.config.js
│   └── package.json
├── backend/           # Django project
│   ├── manage.py
│   ├── <project>/     # Django project settings
│   └── api/           # App containing the view that calls OpenAI
└── .gitignore         # Excludes env files, venvs, node_modules, .pyc, local SQLite DB
Running Locally
Prerequisites
Node.js 20 or higher
Python 3.11 or higher
An OpenAI API key
Backend
bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate

Create a local .env file in backend/ containing your OpenAI API key (see Environment Variables), then start the server:

bash
python manage.py runserver      # runs on http://localhost:8000
Frontend
bash
cd frontend
npm install
npm run dev                     # runs on http://localhost:5173

With both servers running, open http://localhost:5173 in a browser. Any message typed into the chat interface travels through Django to OpenAI and back.

Environment Variables
Where	Purpose
Backend .env / Render	OpenAI API key (never committed)
Render (injected automatically)	Render hostname, added to Django's allowed hosts
Frontend (Vercel / local)	Backend URL, so switching between local and production is a configuration change rather than a code change

Add a .env.example listing the variable names (without values) so setup doesn't require guesswork.

API

POST request to the backend API endpoint with a JSON body containing a single message field:

json
{ "message": "Hello!" }

Response — JSON with a response field containing the model's reply:

json
{ "response": "Hi there! How can I help?" }

During development you can test the endpoint directly with curl or a PowerShell REST call, without involving the frontend. This is useful for isolating whether a problem lies in the backend or in the connection between the two.

bash
curl -X POST <BACKEND_URL>/<api-path> \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
Deployment

Both services deploy from the same GitHub repository.

Backend — Render
Python web service, root directory set to backend
Build command installs from the requirements file
Start command runs gunicorn against the Django WSGI application
OpenAI API key is provided through Render's environment variable settings, not a committed file
Frontend — Vercel
Static site, root directory set to frontend
Build handled automatically by Vercel's Vite detection
Reads the backend URL from an environment variable
Configuration notes
The backend accepts requests from both the local Vite development origin and the deployed Vercel origin
Debug mode is disabled in production
The Django secret key is a development placeholder and should be replaced with a secure value before any real deployment
Grounding the Model

The system prompt sent to the model includes the current date at the time of the request. This small grounding technique lets the model answer time-sensitive questions correctly, since the underlying model has a knowledge cutoff and does not otherwise know what day it is. It is a minimal example of the context injection production LLM applications rely on to keep responses accurate and useful.

Lessons Learned

During development, the OpenAI API key was accidentally committed to the repository. GitHub's push protection blocked the push, which prompted a rewrite of the Git history to remove the offending file and a revocation of the leaked key in the OpenAI dashboard. A fresh key now lives only in Render's environment settings and the local environment file, which is excluded from version control. Takeaway: check that environment files are ignored before the first commit of any project involving external API credentials.
