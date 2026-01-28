from shared.database import engine,Base
from . import models,schemas
from fastapi import FastAPI,Depends,HTTPException
from sqlalchemy.orm import Session
from shared.security import get_current_user
from shared.database import get_db

Base.metadata.create_all(bind=engine)

app=FastAPI()


@app.post("/tariffs",response_model=schemas.TariffOut)
def create_tariff(
    tariff:schemas.TariffCreate,
    db:Session=Depends(get_db),
    current_user:dict=Depends(get_current_user)
):
    
    if current_user["role"]!="admin":
        raise HTTPException(status_code=403,detail="Bu işlem için admin yetkisi gerekli.")
    
    db_tariff=models.Tariff(**tariff.model_dump())
    db.add(db_tariff)
    db.commit()
    db.refresh(db_tariff)
    return db_tariff

@app.get("/tariffs")
def list_tariffs(db:Session=Depends(get_db)):
    return db.query(models.Tariff).all()


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "logistics-service", "version": "1.0.0"}