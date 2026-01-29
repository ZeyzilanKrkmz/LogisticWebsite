import redis
import json
import os

r=redis.Redis(host='redis',port=6379,db=0,decode_responses=True)


def handle_notification(message):
    data=json.loads(message['data'])
    event_type=data.get("event")

    if event_type=="user_registered":
        print(f"📧 E-posta gönderiliyor: Hoş geldin {data['email']}!")

    elif event_type == "order_placed":
        print(f"📦 Sipariş Bildirimi: {data['order_id']} nolu sipariş alındı.")

    elif event_type == "chatbot_help_needed":
        print(f"🤖 AI Uyarısı: Bir kullanıcı chatbot ile sorun yaşıyor!")

def start_worker():
    pubsub=r.pubsub()
    pubsub.subscribe('logistic_events')
    print("Communication worker dinlemede...")

    for message in pubsub.listen():
        if message['type']=='message':
            handle_notification(message)

if __name__=="__main__":
    start_worker()