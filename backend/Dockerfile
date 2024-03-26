# Use a Python base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the entire project directory to the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port if your application runs on a specific port
EXPOSE 80

# Set the entry point for the container
CMD ["python", "main.py"]
