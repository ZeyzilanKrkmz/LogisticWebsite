# services/chatbot/Dockerfile
FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Chatbot gereksinimlerini yükle
COPY services/chatbot/requirements.txt ./services/chatbot/requirements.txt
RUN pip install --no-cache-dir -r ./services/chatbot/requirements.txt

COPY shared/ ./shared/
COPY services/chatbot/ ./services/chatbot/

ENV PYTHONPATH=/app
EXPOSE 8000

# Chatbot API'sini çalıştır
CMD ["uvicorn", "services.chatbot.main:app", "--host", "0.0.0.0", "--port", "8000"]