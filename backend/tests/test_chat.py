import pytest
from httpx import AsyncClient
from unittest.mock import patch

@pytest.mark.asyncio
@patch("routers.chat.ask_career_chatbot_response")
async def test_ask_chat(mock_ask, async_client: AsyncClient):
    mock_ask.return_value = "Mocked chat response"
    payload = {
        "message": "Hello",
        "session_id": "test_session"
    }
    response = await async_client.post("/chat/ask", json=payload)
    assert response.status_code == 200
    assert response.json()["response"] == "Mocked chat response"

@pytest.mark.asyncio
@patch("routers.chat.ask_career_chatbot_response")
async def test_ask_chat_error(mock_ask, async_client: AsyncClient):
    mock_ask.side_effect = RuntimeError("Service unavailable")
    payload = {
        "message": "Hello",
        "session_id": "test_session"
    }
    response = await async_client.post("/chat/ask", json=payload)
    assert response.status_code == 503
