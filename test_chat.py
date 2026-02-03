import requests
import json

def test_gemini_chat(user_prompt):
    # Gateway portun 8004 olarak ayarlıydı
    url = "http://localhost:8004/chat"
    
    # POST isteği için göndereceğimiz veri
    payload = {
        "prompt": user_prompt
    }
    
    headers = {
        "Content-Type": "application/json"
    }

    print(f"--- Gemini'ye Soru Soruluyor: {user_prompt} ---")
    
    try:
        # İsteği gönderiyoruz
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        
        # HTTP Durum Kodunu Kontrol Edelim
        if response.status_code == 200:
            result = response.json()
            print("\n✅ Gemini'den Cevap Geldi:")
            print(f"Cevap: {result.get('answer')}")
        else:
            print(f"\n❌ Hata Oluştu! Durum Kodu: {response.status_code}")
            print(f"Hata Detayı: {response.text}")
            
    except requests.exceptions.Timeout:
        print("\n⏳ Zaman Aşımı: Gemini çok uzun sürede cevap veremedi.")
    except Exception as e:
        print(f"\n💥 Beklenmedik Bir Hata: {e}")

if __name__ == "__main__":
    # Test sorumuzu soralım
    test_gemini_chat("İzmir'den İstanbul'a kargo gönderim süresi nedir?")