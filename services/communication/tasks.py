from celery import Celery
import os

redis_url=os.getenv("REDIS_URL","redis://localhost:6379/0")
app=Celery('tasks',broker=redis_url)


@app.task
def send_offer_notification(email:str,offer_details:dict):
    print(f"📧{email} adresine teklif detayları gönderiliyor:{offer_details}")
    return "başarılı"