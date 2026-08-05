# Dot2 Weather

A small full-stack weather web app that lets a user search for a city, region, or postal code and see its current weather.

**Live demo:** [my-app-u9mb.onrender.com](https://my-app-u9mb.onrender.com)

## What the app does

The page accepts a location such as `London`, `Tokyo`, or a postal code. It then shows the current temperature, feels-like temperature, humidity, wind speed, local time, and a weather-condition icon.

The API key is handled only by the backend. The browser never receives it.

## How it works

```text
Browser
  │  GET /api/weather?q=London
  ▼
Flask app (main.py)
  │  Uses private api_key environment variable
  ▼
WeatherAPI.com
  │  Current-weather JSON
  ▼
Flask returns JSON to the browser
  ▼
React renders the weather card
```

### Frontend

The UI lives in `frontend/` and uses React in the browser.

- `frontend/index.html` loads the page and React dependencies.
- `frontend/app.jsx` manages the location input, loading state, errors, quick-city buttons, and the weather result card.
- `frontend/style.css` provides the visual styling.

When the user submits a location, `app.jsx` calls:

```text
/api/weather?q=<location>
```

Using a relative URL means the frontend works both locally and on Render without hard-coding a server address.

### Backend

`main.py` is a Flask server. It has two responsibilities:

1. Serve the frontend files at `/`.
2. Provide `/api/weather` as a small backend proxy for WeatherAPI.com.

The endpoint validates that a location query was supplied, forwards the request to WeatherAPI.com, and returns the JSON response. If WeatherAPI.com returns an error, the backend passes a readable error message to the frontend.

### API-key security

The backend reads the WeatherAPI key from an environment variable named `api_key`:

```python
API_KEY = os.getenv("api_key")
```

For local development, the value is kept in a private `.env` file. The repository includes `.env.example` as a safe template, while `.gitignore` prevents the real `.env` file from being committed. The Docker build also excludes `.env`, so the key is not baked into an image.

To use your own key, create a free account at [WeatherAPI.com](https://www.weatherapi.com/signup.aspx), then create a local `.env` file:

```dotenv
api_key=your_weatherapi_com_key
```

## Docker and Render

The `Dockerfile` packages the app with Python and `uv`, installs the dependencies locked in `uv.lock`, and starts Flask with:

```text
uv run main.py
```

The app listens on the port in the `PORT` environment variable. It defaults to `8000` locally, while Render supplies `PORT` automatically in production.

On Render, set `api_key` as a secret environment variable in the service settings. Do not place the key in the repository, the Dockerfile, or a Docker build argument.

## Project structure

```text
.
├── frontend/
│   ├── app.jsx          # Search behaviour and weather-card rendering
│   ├── index.html       # Browser entry point
│   └── style.css         # UI styling
├── main.py              # Flask server and WeatherAPI proxy endpoint
├── Dockerfile            # Production container configuration
├── .env.example          # Safe example of required environment variables
├── pyproject.toml        # Python dependencies and project metadata
└── uv.lock               # Reproducible dependency lockfile
```

## Run locally

```bash
uv sync --frozen
uv run main.py
```

Then open [http://localhost:8000](http://localhost:8000). You need a valid `.env` file first.

## Run with Docker

```bash
docker build -t dot2-weather .
docker run --rm --env-file .env -p 8000:8000 dot2-weather
```

## Troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| `Environment variable api_key is required.` | `.env` is missing or uses the wrong variable name. | Create `.env` from `.env.example` and use lowercase `api_key`. |
| Weather search returns an error. | Invalid, inactive, or quota-limited WeatherAPI key. | Check the key in the WeatherAPI dashboard. |
| The Render deployment cannot load weather data. | `api_key` is not set in Render. | Add it as a secret environment variable and redeploy. |
