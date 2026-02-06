import os
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

template = """Aşağıdaki dökümanlara dayanarak soruyu profesyonel bir lojistik uzmanı gibi yanıtla.

KURALLAR:
1. DİL UYUMU: Soruyu hangi dilde aldıysan (İngilizce, Türkçe vb.) o dilde yanıt ver. 
2. FORMAT: "Giriş", "Nedenler" gibi başlıklar veya madde işaretleri ASLA kullanma.
3. AKICILIK: Cevabı tek bir paragraf veya en fazla iki kısa paragraf şeklinde, akıcı bir metin olarak yaz.
4. İÇERİK: Dökümanlardaki bilgileri kullanarak doğrudan ve açıklayıcı bir cevap sun. Gereksiz dolgu cümlelerinden kaçın.

Dökümanlar: {context}
Soru: {question}
Yanıt (Soruyla aynı dilde):"""

PROMPT = PromptTemplate(template=template, input_variables=["context", "question"])


def create_logistics_agent():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, "data")

    try:
        # 1. Dokümanları Yükle
        loader = DirectoryLoader(data_path, glob="./*.txt", loader_cls=TextLoader)
        documents = loader.load()
        print(f"✅ {len(documents)} döküman yüklendi.")

        # 2. Ücretsiz ve Stabil Embedding Modeli (HuggingFace)
        # Gemini hatası almamak için bunu lokalde çalıştırıyoruz
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # 3. Vektör Veritabanı
        vectorstore = FAISS.from_documents(documents, embeddings)
        print("✅ Vektör veritabanı hazır.")

        # 4. Groq LLM Yapılandırması
        # Groq API Key'ini .env dosyana GROQ_API_KEY olarak eklemeyi unutma
        llm = ChatGroq(
            temperature=0, 
            model_name="llama-3.3-70b-versatile", # Ücretsiz ve çok hızlı model
            groq_api_key=os.getenv("GROQ_API_KEY"),
            max_retries=2
        )

        # 5. RAG Chain
        rag_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(),
            chain_type_kwargs={"prompt":PROMPT}
        )
        print("🚀 Groq RAG Ajanı Hazır!")
        return rag_chain

    except Exception as e:
        print(f"💥 Groq Ajan Hatası: {str(e)}")
        return None