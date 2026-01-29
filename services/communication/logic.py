from enum import Enum

class NotificationType(str,Enum):
    ORDER_STATUS="order_status"
    AUTH_WELCOME="welcome"
    CHATBOT_ALERT="ai_alert"
    TRACKING_UPDATE="tracking"


    async def route_notification(notif_type: NotificationType, data:dict):
        if notif_type==NotificationType.AUTH_WELCOME:
            return{"status":"email_sent","to":data['email'],"template":"welcome_pack"}
        
        elif notif_type==NotificationType.ORDER_STATUS:
            return {"status":"push_notif","order_id":data['order_id'],"msg":"Yolda!"}