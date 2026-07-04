import os
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

load_dotenv()

store: dict[str, ChatMessageHistory] = {}
chat_with_memory: RunnableWithMessageHistory | None = None

prompt_with_memory = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful AI assistant. Answer clearly and accurately."),
        ("placeholder", "{chat_history}"),
        ("human", "{user_input}"),
    ]
)


def get_history(session_id: str) -> ChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


def get_chat_with_memory() -> RunnableWithMessageHistory:
    global chat_with_memory
    if chat_with_memory is not None:
        return chat_with_memory

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not configured. Set the environment variable to use the chat endpoint."
        )

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=api_key,
        temperature=0.5,
    )

    chain_with_memory = prompt_with_memory | llm

    chat_with_memory = RunnableWithMessageHistory(
        runnable=chain_with_memory,
        get_session_history=get_history,
        input_message_key="user_query",
        history_message_key="chat_history",
    )
    return chat_with_memory


def ask_career_chatbot_response(question: str, session_id: str = "default") -> str:
    chat = get_chat_with_memory()
    response = chat.invoke(
        {"user_query": question},
        {"configurable": {"session_id": session_id}},
    )
    return response.content