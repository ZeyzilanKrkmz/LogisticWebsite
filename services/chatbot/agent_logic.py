from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain_openai import ChatOpenAI  # Ensure this module is installed
from .tools import check_kargo_status, get_tariff_info


def create_logistics_agent():
    llm=ChatOpenAI("gpt-4-turbo",temperature=0)

    tools=[check_cargo_status,get_tariff_info]


    prompt="""Sen profesyonel bir Lojistik Yapay Zeka Danışmanısın. 
    1. Şirket bilgileri için RAG aracını kullan.
    2. Dinamik veriler (fiyat, takip) için API araçlarını kullan.
    3. Bilmediğin konularda uydurma, 'Bilmiyorum' de."""

    agent=create_openai_functions_agent(llm,tools,prompt)
    return AgentExecutor(agent=agent,tools=tools,verbose=True)
