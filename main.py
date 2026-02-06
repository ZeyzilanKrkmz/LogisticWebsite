from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re


from services.chatbot.agent_logic import create_logistics_agent
from services.auth.security import verify_password
from services.order.main import create_offer

app = FastAPI(title="LogisticWebsite API Gateway")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


agent_executor=create_logistics_agent()


class ChatRequest(BaseModel):
    prompt:str

@app.get("/")
def read_root():
    return {"status":"Logistic API Gateway is online","version":"2026.1"}


@app.get("/health")
def health_check():
    return {
        "status":"healthy",
        "agent_ready":agent_executor is not None
    }

"""@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # ... ajan kontrolleri ...
    try:
        response = agent_executor.invoke({"query": request.prompt})
        raw_answer = response.get("result", "")

        # 1. Parantezleri ve içindekileri tamamen kaldır
        clean_text = re.sub(r'\(.*?\)', '', raw_answer)
        
        # 2. Madde işaretlerini (-, *, •) ve boşluklarını kaldır
        clean_text = re.sub(r'[-*•]\s*', '', clean_text)
        
        # 3. Satır başlarını (\n) ve tabları boşluğa çevir
        clean_text = clean_text.replace("\n", " ").replace("\r", " ")

        clean_text = re.sub(r'\d+\.\s+\*\*[A-ZÇĞİÖŞÜ ]+\*\*:', '', raw_answer)
        clean_text = re.sub(r'\*\*[A-ZÇĞİÖŞÜ ]+\*\*:', '', clean_text)

# 2. Yıldızları (bold işaretlerini) ve parantezleri temizle
        clean_text = clean_text.replace("*", "").replace("(", "").replace(")", "")

        clean_text = re.sub(r'\s+', ' ', clean_text).strip()

        # 6. Profesyonel bir ton için cümlenin baş harfini ve son noktasını kontrol et
        if clean_text and not clean_text.endswith('.'):
            clean_text += '.'


        final_output = str(clean_text)
        final_output = final_output.replace('\\n', ' ').replace('\n', ' ')
        final_output = re.sub(r'[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ .,?!]', '', final_output) # Harf, rakam ve nokta dışı HER ŞEYİ siler

        return {"answer": final_output}
        
    except Exception as e:
        print(f"💥 Chat Hatası: {str(e)}")
        raise HTTPException(status_code=500, detail="Sistem hatası.")
"""

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Gelen metni temizle (Gelen sorudaki garip karakterleri uçur)
        user_query = request.prompt.encode("ascii", "ignore").decode("ascii").strip()
        
        if not user_query:
            return {"answer": "Üzgünüm, sorunuzu anlayamadım. Lütfen tekrar dener misiniz?"}

        print(f"📩 İşlenen Soru: {user_query}")
        
        # 2. Ajanı çağır
        response = agent_executor.invoke({"query": user_query})
        raw_answer = response.get("result", "")

        if not raw_answer:
            return {"answer": "Dökümanlarımda bu konuyla ilgili bir bilgi bulamadım."}

        # 3. Senin istediğin o sade metin temizliği (Balyoz yöntemi)
        import re
        # Başlıkları ve gereksiz etiketleri sil
        clean_text = re.sub(r'\d+\.\s+\*\*[A-ZÇĞİÖŞÜ ]+\*\*:', '', raw_answer)
        clean_text = re.sub(r'[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ .,?!:]', ' ', clean_text)
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()

        return {"answer": clean_text}
        
    except Exception as e:
        print(f"💥 Chat İşlem Hatası: {str(e)}")
        # Hata türüne göre daha açıklayıcı mesaj
        return {"answer": "Teknik bir aksaklık oluştu, lütfen sorunuzu basitleştirerek tekrar sorun."}
    

    
@app.get("/track/{order_id}")
def track_order(order_id: str):
    # Burada db servisine gidip veri çekeceğiz
    return {"order_id": order_id, "status": "In Transit", "location": "Izmir"}