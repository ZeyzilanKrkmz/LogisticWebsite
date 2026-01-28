from services.order.utils import calculate_shipping_price

def test_calculate_shipping_price_container():
    result=calculate_shipping_price(1000,500,"konteyner")
    assert result==1300.0


def test_calculate_shipping_price_invalid_type():
    result=calculate_shipping_price(1000,500,"unknown")
    assert result==1050.0