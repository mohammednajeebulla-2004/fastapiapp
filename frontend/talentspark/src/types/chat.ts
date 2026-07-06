export interface ChatRequest {
    message: string;
    session_id: string;
}

export interface ChatResponse {
    response: string;
}

export interface Message {
    id: number;
    sender: "user" | "bot";
    text: string;
}