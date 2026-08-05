import os

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory

load_dotenv()
API_KEY = os.getenv("api_key")
if not API_KEY:
    raise RuntimeError("Environment variable api_key is required.")

app = Flask(__name__, static_folder="frontend", static_url_path="")

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/api/weather")
def api_weather():
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify(error="Query parameter 'q' is required."), 400

    url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={query}&aqi=no"
    response = requests.get(url, timeout=10)

    if response.status_code != 200:
        body = response.json()
        message = body.get("error", {}).get("message") if isinstance(body, dict) else None
        return jsonify(error=message or "Unable to fetch weather data."), response.status_code

    return jsonify(response.json())

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=True)
