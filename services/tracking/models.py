from sqlalchemy import Column, Integer, String, DatTime, ForeignKey
from shared.database import Base
import datetime

class ShipmentStatus(Base):
    __tablename__="shipment_statuses"

    id=Column(Integer,primary_key=True)
    order_id=Column(Integer,unique=True)
    tracking_code=Column(String,unique=True,index=True)
    current_location=Column(String)
    status=Column(String)
    updated_at=Column(DatTime,default=datetime.datetime.utcnow)

class ShipmentHistory(Base):
    __tablename__="shipment_history"

    id=Column(Integer,primary_key=True)
    shipment_id=Column(ForeignKey("shipment_statuses.id"))
    location=Column(String)
    description=Column(String)
    recorded_at=Column(DatTime,default=datetime.datetime.utcnow)