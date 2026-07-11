import os
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from services.qdrant_service import search_jobs

load_dotenv(override=True)

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.3,
)

rag_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are a job search assistant.

Use only the retrieved job listings below to answer the user's question.

If no relevant jobs are found, clearly say that no matching jobs were found.

Retrieved Jobs:
{context}
""",
        ),
        ("human", "{question}"),
    ]
)

rag_chain = rag_prompt | llm


def rag_job_search(question: str) -> str:
    results = search_jobs(question, top_k=5)

    if not results:
        return (
            "No jobs found in the database. "
            "Please embed jobs first using the /rag/embed-jobs endpoint."
        )

    context = "\n".join(
        [
            f"### {r['title']}\n"
            f"- **Description:** {r['description']}\n"
            f"- **Salary:** ₹{r['salary']}\n"
            f"- **Match Score:** {round(r['score'] * 100, 1)}%\n"
            for r in results
        ]
    )

    response = rag_chain.invoke(
        {
            "context": context,
            "question": question,
        }
    )

    return response.content