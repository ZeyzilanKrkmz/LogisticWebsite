FROM python:3.11-slim

RUN apt-get update && apt-get install -y build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Burası kritik: Context monorepo kökü olduğu için yol böyle olmalı
COPY services/auth/requirements.txt ./services/auth/requirements.txt
RUN pip install --no-cache-dir -r ./services/auth/requirements.txt

COPY shared/ ./shared/
COPY services/auth/ ./services/auth/


ENV PYTHONPATH=/app

CMD ["uvicorn", "services.auth.main:app", "--host", "0.0.0.0", "--port", "8000"]