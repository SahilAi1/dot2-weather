# Dot2 Weather

A small full-stack weather application built with Flask and a React frontend. Search for a city, region, or postal code to see current weather, including temperature, humidity, wind, and conditions.

**Live demo:** [my-app-u9mb.onrender.com](https://my-app-u9mb.onrender.com)

## Features

- Search weather by city, region, or postal code
- Live current-weather data from [WeatherAPI.com](https://www.weatherapi.com/)
- Flask API backend and React frontend
- API key stays on the server; it is never sent to the browser
- Docker-ready deployment

## Tech stack

- Python 3.14+
- Flask
- React (loaded in the browser)
- [uv](https://docs.astral.sh/uv/) for Python dependency management
- Docker

## Prerequisites

Install the following before running the project locally:

- [Python 3.14+](https://www.python.org/downloads/)
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- A free [WeatherAPI.com](https://www.weatherapi.com/signup.aspx) account and API key

Docker is optional, but required for the Docker instructions below.

## Get your own WeatherAPI key

1. Go to [WeatherAPI.com sign-up](https://www.weatherapi.com/signup.aspx) and create an account.
2. In the WeatherAPI dashboard, copy your API key.
3. From the project root, create your private environment file:

   ```bash
   cp .env.example .env
   ```

4. Open `.env` and replace the placeholder value:

   ```dotenv
   api_key=your_actual_weatherapi_com_key
   ```

`api_key` must stay lowercase because that is the environment-variable name used by `main.py`.

> Never commit `.env`. It is excluded by both `.gitignore` and `.dockerignore`. Commit `.env.example` only.

## Run locally with uv

1. Clone the repository and enter it:

   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/dot2-weather.git
   cd dot2-weather
   ```

2. Create `.env` using the steps above.
3. Install the locked dependencies:

   ```bash
   uv sync --frozen
   ```

4. Start the app:

   ```bash
   uv run main.py
   ```

5. Visit [http://localhost:8000](http://localhost:8000) in your browser.

To stop the server, press `Ctrl+C` in the terminal.

## Run with Docker

1. Create `.env` as described in [Get your own WeatherAPI key](#get-your-own-weatherapi-key).
2. Build the image:

   ```bash
   docker build -t dot2-weather .
   ```

3. Run the container and pass the API key securely from `.env`:

   ```bash
   docker run --rm --env-file .env -p 8000:8000 dot2-weather
   ```

4. Visit [http://localhost:8000](http://localhost:8000).

Do not use `--build-arg` for the API key, and do not put the key in the Dockerfile. The `.dockerignore` file prevents `.env` from being copied into the image build context.

## Environment variables

| Name | Required | Description |
| --- | --- | --- |
| `api_key` | Yes | Your private WeatherAPI.com API key. |
| `PORT` | No | Server port. Defaults to `8000`; Render provides this automatically. |

## Deploying to Render

The live version is deployed at [https://my-app-u9mb.onrender.com](https://my-app-u9mb.onrender.com).

For a new Render deployment:

1. Create a new **Web Service** and connect this GitHub repository.
2. Use `Docker` as the environment so Render uses the included `Dockerfile`.
3. In **Environment**, add a secret environment variable named `api_key` and paste your WeatherAPI key as its value.
4. Deploy. Render supplies `PORT` automatically.

Never add the API key to the GitHub repository or Render build arguments.

## Project structure

```text
.
├── frontend/          # React UI, styles, and HTML entry point
├── main.py            # Flask server and /api/weather endpoint
├── Dockerfile         # Container build and startup instructions
├── .env.example       # Safe API-key template
├── pyproject.toml     # Python project metadata and dependencies
└── uv.lock            # Locked dependency versions
```

## Troubleshooting

### `Environment variable api_key is required.`

Create `.env` from `.env.example` and make sure it contains a valid `api_key` value.

### WeatherAPI returns an error

Check that your API key is active, has not exceeded its quota, and that the location query is valid.

### Docker does not load the key

Confirm that `.env` is in the project root and that you started the container with `--env-file .env`.

## Security notes

- Keep `.env` private.
- Use a separate API key for public deployments if possible.
- If a key is ever committed or shared accidentally, revoke it in WeatherAPI.com and create a new one immediately.
