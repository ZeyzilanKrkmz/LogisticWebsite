from fastapi import FastAPI
from services.chatbot.agent_logic import create_logistics_agent
import os

app = FastAPI()

# Uygulama başlarken ajanı tek seferlik oluştur
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
    return {"answer": response["output"]}