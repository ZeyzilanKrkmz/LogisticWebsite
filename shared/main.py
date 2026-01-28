from fastapi import FastAPI, Depends
from shared.security import get_current_user

app = FastAPI()

@app.get("/my-shipments")
def read_my_shipments(current_user: dict = Depends(get_current_user)):
    return {"message": f"Hoşgeldin, {current_user['email']},yüklerin listeleniyor..."}

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "shared-service", "version": "1.0.0"}