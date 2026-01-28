from pydantic import BaseModel

class OfferRequest(BaseModel):
    origin:str
    destination:str
    cargo_type:str
    weight:float

class OfferedResponse(BaseModel):
    id:int
    estimated_price:float
    status:str