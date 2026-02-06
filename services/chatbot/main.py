"""from fastapi import FastAPI
from services.chatbot.agent_logic import create_logistics_agent
import os

app = FastAPI()


try:
    agent_executor = create_logistics_agent()
    print("✅ Gemini Ajanı başarıyla yüklendi!")
except Exception as e:
    print(f"❌ Ajan yüklenirken hata oluştu: {e}")
    agent_executor = None

@app.get("/health")
def health_check():
    return {
        "status": "ok", 
        "agent_ready": agent_executor is not None
    }

@app.get("/chat")
def chat(prompt: str):
    if not agent_executor:
        return {"error": "AI Ajanı hazır değil. Lütfen API anahtarını kontrol et."}
    
    response = agent_executor.invoke({"input": prompt})
    return {"answer": response["output"]}"""


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.chatbot.agent_logic import create_logistics_agent
import os
app = FastAPI(title="ZI Logistics AI API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    prompt: str


agent_executor = None

try:
    print("🔄 AI Ajanı hazırlanıyor...")
    agent_executor = create_logistics_agent()
    if agent_executor:
        print("✅ Ajan başarıyla başlatıldı ve belleğe alındı.")
    else:
        print("⚠️ Uyarı: Ajan 'None' olarak döndü.")
except Exception as e:
    print(f"💥 KRİTİK HATA: Ajan yüklenirken bir sorun oluştu: {str(e)}")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "agent_ready": agent_executor is not None
    }

# 4. Chat Endpoint - POST Metodu
@app.post("/chat")
async def chat_endpoint(request: ChatRequest): # ChatRequest modelini kullanarak doğrula
    if not agent_executor:
        raise HTTPException(
            status_code=503, 
            detail="AI Ajanı şu an hizmet veremiyor. Lütfen sistem loglarını kontrol edin."
        )

    try:
        user_query = request.prompt
        print(f"📩 Gelen Soru: {user_query}")
        response = agent_executor.invoke({"query": user_query})
        raw_answer = response.get("result", "")
        clean_answer = raw_answer.replace("S: ", "**Soru:** ").replace("C: ", "**Cevap:** ")

        return {"answer": clean_answer.strip()}
        
    except Exception as e:
        print(f"💥 Chat İşlem Hatası: {str(e)}")
        raise HTTPException(status_code=500, detail="Yanıt üretilirken bir iç hata oluştu.")