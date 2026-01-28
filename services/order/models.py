from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from shared.database import Base
import datetime

class Offer(Base):
    __tablename__="offers"

    id=Column(Integer, primary_key=True,index=True)
    user_id=Column(Integer,index=True)


    origin=Column(String)
    destination=Column(String)
    cargo_weight=Column(Float)
    estimated_price=Column(Float)

    status=Column(String,default="pending")
    created_at=Column(DateTime,default=datetime.datetime.utcnow)

class Order(Base):
    __tablename__="orders"


    id=Column(Integer,primary_key=True,index=True)
    offer_id=Column(Integer,ForeignKey("offers.id"))
    tracking_number=Column(String,unique=True,index=True)
    current_status=Column(String,default="ordered")

    offer=relationship("Offer")