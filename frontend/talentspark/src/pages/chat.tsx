import { useState } from "react";
import { sendMessage } from "../Services/ChatService";
import type { Message } from "../types/chat";

const Chat = () => {

    const [input, setInput] = useState("");

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: "bot",
            text: "Hello 👋 How can I help you today?"
        }
    ]);

    const [loading, setLoading] = useState(false);

    const handleSend = async () => {

        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            sender: "user",
            text: input
        };

        setMessages(prev => [...prev, userMessage]);

        const currentMessage = input;

        setInput("");

        setLoading(true);

        try {

            
            const result = await sendMessage(currentMessage, "user1");

            const botMessage: Message = {
                id: Date.now() + 1,
                sender: "bot",
                text: result.response
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 2,
                    sender: "bot",
                    text: "Unable to connect to server."
                }
            ]);

        }

        setLoading(false);

    };

    return (

        <div className="chat-container">

            <div className="chat-header">
                AI Assistant
            </div>

            <div className="chat-body">

                {messages.map((msg) => (

                    <div
                        key={msg.id}
                        className={
                            msg.sender === "user"
                                ? "user-message"
                                : "bot-message"
                        }
                    >
                        {msg.text}
                    </div>

                ))}

                {loading && (
                    <div className="bot-message">
                        Typing...
                    </div>
                )}

            </div>

            <div className="chat-footer">

                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                />

                <button onClick={handleSend}>
                    Send
                </button>

            </div>

        </div>

    );
};

export default Chat;