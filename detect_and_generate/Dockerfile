# Use a lightweight official Python image
FROM python:3.10-slim

# Set environment variables to prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies required by image processing and ML packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Flask application code (including the trained .keras model)
COPY . .

# Hugging Face Spaces exposes port 7860 by default for custom docker containers
ENV PORT=7860
EXPOSE 7860

# Command to run the Flask application
CMD ["python", "app.py"]
