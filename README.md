🚀 Proje Hakkında




Sistem, yerel .txt dökümanlarındaki lojistik verilerini (rota bilgileri, araç tipleri, gecikme riskleri vb.) kullanarak kullanıcıya stratejik yanıtlar sunar. Groq LPU altyapısı ve Llama 3.3 70B modeli sayesinde milisaniyeler içinde yüksek zekalı analizler üretir.

✨ Temel Özellikler
-Hızlı RAG Pipeline: FAISS ve HuggingFace embedding modelleri ile döküman tabanlı akıllı arama.

-Ultra Hızlı Yanıt: Groq API entegrasyonu ile Llama 3.3 70B performansı.

-Dil Duyarlılığı: Sorulan dile göre (Türkçe/İngilizce) otomatik yanıt adaptasyonu.

-Temiz Çıktı: Regex filtreleri ile ham metindeki gereksiz karakterlerden arındırılmış, profesyonel üslup.

-Entegre Takip Paneli: React tabanlı modern arayüz üzerinden sipariş ve rota takibi.

🛠️ Teknoloji Yığını (Tech Stack)
Backend:
-Framework: FastAPI

-LLM: Groq (Llama 3.3 70B Versatile)

-Orchestration: LangChain

-Vector DB: FAISS

-Embedding: HuggingFace (all-MiniLM-L6-v2)

Frontend:
-Library: React.js (Vite)

-State Management: Hooks (useChat, useMemo)

-Styling: Tailwind CSS & Lucide Icons

-HTTP Client: Axios

-DevOps
-Containerization: Docker & Docker Compose

⚙️ Kurulum (Setup)
Depoyu Klonlayın:

Bash
git clone https://github.com/kullaniciadi/logistic-ai-assistant.git
cd logistic-ai-assistant
Çevresel Değişkenleri Ayarlayın: .env dosyası oluşturun ve Groq API anahtarınızı ekleyin:

Plaintext
GROQ_API_KEY=your_groq_api_key_here
Docker Compose ile Başlatın:

Bash
docker-compose up -d --build
Erişim:

Frontend: http://localhost:5173

Backend: http://localhost:8004

🚧 Mevcut Durum ve Yol Haritası
-Proje şu anda aktif olarak geliştirilmeye devam etmektedir. Gelecek güncellemelerde planlanan özellikler:

-CAD çizim analizlerinin sisteme entegre edilmesi.

-PDF ve Excel dökümanlarını otomatik işleme desteği.

-Geçmiş sohbetlerin veritabanında (PostgreSQL) saklanması.

-Daha detaylı risk tahmin algoritmaları.

👤 Geliştirici
Zeynep Zilan Korkmaz
