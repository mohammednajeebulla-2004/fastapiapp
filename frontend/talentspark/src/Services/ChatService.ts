import type { ChatRequest, ChatResponse } from "../types/chat";

const API_URL = "http://127.0.0.1:8000/chat/ask";

export const sendMessage = async (
    message: string,
    sessionId: string
): Promise<ChatResponse> => {

    const body = {
        message,
        session_id: sessionId,
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error("Failed to connect to chatbot");
    }

    return await response.json();
};