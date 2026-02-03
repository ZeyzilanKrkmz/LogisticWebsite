from pydantic import BaseModel

class TariffBase(BaseModel):
    origin:str
    destination:str
    cargo_type:str
    base_price:str
    distance_km:int

class TariffCreate(TariffBase):
    pass

class TariffOut(TariffBase):
    id:int
    
    class Config:
        from_attributes=True