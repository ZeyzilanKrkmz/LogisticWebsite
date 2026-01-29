def calculate_shipping_price( base_price:float, distance:int, cargo_type:str):
    multipliers={
        "konteyner":1.2,
        "likit":1.5,
        "kuru_yuk":1.0,
        "tehlikeli_madde":2.5
    }

    multiplier=multipliers.get(cargo_type.lower(),1.0)

    total=base_price+(distance*0.5*multiplier)
    return round (total,2)