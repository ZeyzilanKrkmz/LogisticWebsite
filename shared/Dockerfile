# 1. Aşama: Hafif bir Python imajı
FROM python:3.11-slim

# 2. Aşama: Sistem bağımlılıklarını yükle (Postgres bağlantısı için gerekebilir)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 3. Aşama: Bağımlılıklar (Önce kopyalamak 'cache' avantajı sağlar)
COPY services/auth/requirements.txt ./services/auth/requirements.txt
RUN pip install --no-cache-dir -r ./services/auth/requirements.txt

# 4. Aşama: Shared ve Servis kodlarını kopyala
COPY shared/ ./shared/
COPY services/shared/ ./services/shared/

# 5. Aşama: Python yolu ayarı
ENV PYTHONPATH=/app

# Servis hangi portta çalışacaksa o (Örn: Auth için 8000)
EXPOSE 8000

CMD ["uvicorn", "services.auth.main:app", "--host", "0.0.0.0", "--port", "8000"]