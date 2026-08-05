# Use a lightweight Python image with uv pre-installed
FROM ghcr.io/astral-sh/uv:python3.14-alpine

# Set the working directory inside the container
WORKDIR /app

# Keep Python output unbuffered for logs and use faster startup bytecode
ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1
ENV PORT=8000

# Copy dependency metadata first to leverage build cache
COPY pyproject.toml uv.lock ./

# Install dependencies in the container environment
RUN uv sync --frozen --no-install-project

# Copy application source and frontend assets
COPY . .

# Expose the Flask service port
EXPOSE 8000

# Start the Flask-backed weather app
CMD ["uv", "run", "main.py"]