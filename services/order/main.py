from fastapi import FastAPI, Depends,HTTPException
from shared.database import engine, Base, SessionLocal,get_db
from shared.security import get_current_user
from services.order import models,schemas
from services.communication.tasks import send_offer_notification
from services.order.models import OfferSchema  
from sqlalchemy.orm import Session
import requests


Base.metadata.create_all(bind=engine)

app = FastAPI()

LOGISTICS_SERVICE_URL="http://logistics-service:8000"

@app.post(
        "/create-offer",
        tags=["Sipariş İşlemleri"],
        summary="Yeni Teklif Oluştur",
        description="Kullanıcının girdiği güzergah ve yüke göre fiyat hesaplar ve asenkron bildirim gönderir."
        )
def create_offer(
    request:schemas.OfferRequest,
    db:Session=Depends(get_db),
    current_user:dict=Depends(get_current_user)

):
    tariff_response=requests.get(f"{LOGISTICS_SERVICE_URL}/tariffs/find?origin={request.origin}&dest={request.destination}")

    if tariff_response.status_code!=200:
        raise HTTPException(status_code=404,detail="Bu rota için tarife bulunamadı.")
    
    tariff_data=tariff_response.json()

    price=tariff_data["base_price"]+(request.weights*1.5)


    new_offer=models.Offer(
        user_id=current_user["email"],
        origin=request.origin,
        destination=request.destination,
        estimated_price=price,
        status="pending"
    )
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)

    send_offer_notification.delay(current_user["email"],price,request.origin,request.destination)

    return new_offer


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "order-service", "version": "1.0.0"}