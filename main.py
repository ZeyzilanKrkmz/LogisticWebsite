from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os


from services.chatbot.agent_logic import create_logistics_agent
from services.auth.security import verify_password
from services.order.main import create_offer

app = FastAPI(title="LogisticWebsite API Gateway")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not agent_executor:
        raise HTTPException(status_code=503, detail="Gemini Ajanı hazır değil")
    try:
        response = agent_executor.invoke({"input": request.prompt})
        return {"answer": response["output"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/track/{order_id}")
def track_order(order_id: str):
    # Burada db servisine gidip veri çekeceğiz
    return {"order_id": order_id, "status": "In Transit", "location": "Izmir"}