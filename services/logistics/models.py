from sqlalchemy import Column, Integer, String,Float
from shared.database import Base


class Tariff(Base):
    __tablename__="tariffs"


    id=Column(Integer,primary_key=True,index=True)
    origin=Column(String,nullable=False)
    destination=Column(String,nullable=False)
    cargo_type=Column(String,nullable=False)
    base_price=Column(Float,nullable=False)
    distance_km=Column(Integer)