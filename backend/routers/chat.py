from fastapi import APIRouter, HTTPException
from schemas.chat import ChatRequest, ChatResponse
from services.langchain_service import ask_career_chatbot_response


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/ask", response_model=ChatResponse)
def ask_career_chatbot(request: ChatRequest):
    try:
        ans = ask_career_chatbot_response(request.message, request.session_id)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    return ChatResponse(response=ans)