from fastapi import FastAPI
from shared.database import engine,Base
from services.chatbot import models

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "chatbot-service", "version": "1.0.0"}