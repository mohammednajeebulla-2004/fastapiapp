from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    session_id: str = "user1"
    
class ChatResponse(BaseModel):
    response: str