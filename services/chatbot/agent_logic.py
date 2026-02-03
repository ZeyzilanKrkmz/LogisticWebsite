import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate

def create_logistics_agent():
    # Model ismini 'models/gemini-pro' olarak TAM YOL veriyoruz. 
    # Bu, kütüphanenin başına yanlış bir şey eklemesini engeller.
    llm = ChatGoogleGenerativeAI(
        model="models/gemini-pro", 
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0,
        max_retries=1,
        timeout=10 # Sayfanın sonsuz dönmesini engellemek için deneme sayısını kısıtlıyoruz
    )

    from services.chatbot.tools import check_kargo_status, get_tariff_info
    tools = [check_kargo_status, get_tariff_info]

    template = """Sen profesyonel bir lojistik asistanısın. Aşağıdaki araçları kullan:
    {tools}
    Format:
    Soru: {input}

Araç kullanman gerekiyorsa şu formatı kullan:
Action: {tool_names}
Action Input: ...

Aksi halde direkt:
Final Answer: ..."""

    prompt = PromptTemplate.from_template(template)
    agent = create_react_agent(llm, tools, prompt)
    
    """return AgentExecutor(agent=agent,
                    tools=tools, 
                    verbose=True,
                    handle_parsing_errors=True,
                    max_iterations=3
)"""

    print("LLM INVOKE START")
    resp = llm.invoke("merhaba")
    print("LLM INVOKE END")

    return resp.content

    


