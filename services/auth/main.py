from shared.database import engine,Base,get_db
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from services.auth import models,schemas,security
import json
import redis

Base.metadata.create_all(bind=engine)

app=FastAPI()

r=redis.Redis(host='redis',port=6379,db=0,decode_responses=True)

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Kullanıcı kontrolü
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user: # Parantezleri kaldırdık!
        raise HTTPException(status_code=400, detail="Email zaten kayıtlı.")
    
    # 2. Şifre hashleme ve Kayıt
    # Nokta yerine alt tire (_) kullandık
    hashed_password = security.get_password_hash(user.password) 
    new_user = models.User(email=user.email, hashed_password=hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. Redis'e tek seferde ve güvenli mesaj gönderimi
    try:
        event_data = {"event": "user_registered", "email": new_user.email}
        r.publish('logistics_events', json.dumps(event_data))
        print(f"🚀 Redis'e mesaj fırlatıldı: {new_user.email}")
    except Exception as e:
        print(f"❌ Redis hatası: {e}")

    # 4. Response modeline uygun objeyi dönüyoruz
    return new_user
    hashed_pwd=security.hash_password(user.password)
    new_user=models.User(email=user.email,hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    return new_user


@app.post("/login")
def login(user_credentials:schemas.UserLogin,db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==user_credentials.email).first()
    if not user or not security.verify_password(user_credentials.password,user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Geçersiz bilgiler")
    
    access_token=security.create_access_token(data={"sub":user.email,"role":user.role.value})
    return {"access_token":access_token,"token_type":"bearer"}


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "order-service", "version": "1.0.0"}