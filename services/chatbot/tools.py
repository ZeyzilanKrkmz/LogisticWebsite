from langchain.tools import tool

@tool
def check_kargo_status(order_id: str) -> str:
    """Kargonun güncel durumunu sorgular."""
    # Şimdilik örnek veri dönüyoruz
    return f"{order_id} numaralı kargonuz Balıkesir transfer merkezinden yola çıkmıştır."

@tool
def get_tariff_info(destination: str) -> str:
    """Belirli bir varış noktası için fiyat tarifesini getirir."""
    # Ajanın 'get_tariff_info' olarak aradığı fonksiyon bu
    return f"{destination} varış noktası için güncel lojistik tarifemiz kilogram başına 15 TL'dir."