# To run this code you need to install the following dependencies:
# pip install google-genai python-dotenv

import base64
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables from .env.local file
load_dotenv('.env.local')

# Clear GOOGLE_API_KEY so SDK uses our explicit key
if 'GOOGLE_API_KEY' in os.environ:
    del os.environ['GOOGLE_API_KEY']


def generate():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment")
        return

    client = genai.Client(api_key=api_key)

    model = "gemini-3-pro-preview"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""I'm building "The Rock Salt" - a community website for Salt Lake City's local music scene.

Tech stack: Next.js 14, TypeScript, Tailwind CSS, Supabase (Postgres), deployed on Vercel.

Key features:
- Band directory with profiles, genres, social links
- Event calendar with automated curation from Bandsintown/Songkick
- Venue database
- Live streaming radio player (Utah Music Radio integration)
- Community forum (Discourse integration at therocksalt.discourse.group)
- Music submission system

Target audience: Local Utah musicians, music fans, venue owners

Please review this project concept and give me your honest third-party perspective on:
1. The overall concept and market positioning
2. Feature prioritization - what's essential vs nice-to-have
3. Potential challenges or blind spots
4. Growth/monetization opportunities
5. How to differentiate from existing music discovery platforms

Be direct and critical - I want real feedback, not flattery."""),
            ],
        ),
    ]
    tools = [
        types.Tool(google_search=types.GoogleSearch()),
    ]
    generate_content_config = types.GenerateContentConfig(
        tools=tools,
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")


if __name__ == "__main__":
    generate()

