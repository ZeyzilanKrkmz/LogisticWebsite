from fastapi import FastAPI
from shared.database import engine,Base
from services.tracking import models

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "tracking-service", "version": "1.0.0"}