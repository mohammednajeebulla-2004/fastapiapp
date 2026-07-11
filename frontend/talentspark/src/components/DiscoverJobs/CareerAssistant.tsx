import { useState } from "react";
import "./CareerAssistant.css";

function CareerAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAssistant = async () => {
    if (!question.trim()) {
      alert("Please enter your question.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/rag/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Request failed");
      }

      const data = await response.json();

      console.log("Career Assistant:", data);

      setAnswer(data.answer);

    } catch (error: any) {
      console.error(error);
      setAnswer(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: "var(--text-primary)" }}>{part}</strong> : part);
  };

  const formatResponse = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="res-spacer" style={{ height: "8px" }} />;
      
      if (trimmed.startsWith('### ')) {
        return <h5 key={i} className="res-h3" style={{ color: "var(--primary)", marginTop: "16px", marginBottom: "8px", fontSize: "16px", fontWeight: "700" }}>{trimmed.replace('### ', '')}</h5>;
      }
      if (trimmed.startsWith('## ')) {
        return <h4 key={i} className="res-h2" style={{ color: "var(--primary)", marginTop: "20px", marginBottom: "10px", fontSize: "18px", fontWeight: "700" }}>{trimmed.replace('## ', '')}</h4>;
      }
      if (trimmed.startsWith('# ')) {
        return <h3 key={i} className="res-h1" style={{ color: "var(--primary)", marginTop: "24px", marginBottom: "12px", fontSize: "20px", fontWeight: "700" }}>{trimmed.replace('# ', '')}</h3>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return <li key={i} className="res-li" style={{ color: "var(--text-secondary)", marginLeft: "20px", marginBottom: "6px", lineHeight: "1.6", fontSize: "14px" }}>{parseInlineMarkdown(trimmed.substring(2))}</li>;
      }
      return <p key={i} className="res-p" style={{ color: "var(--text-secondary)", marginBottom: "12px", lineHeight: "1.6", fontSize: "14px" }}>{parseInlineMarkdown(trimmed)}</p>;
    });
  };

  return (
    <div className="career-assistant">

      <div className="assistant-header">

        <h3>Career Assistant</h3>

        <p>
          Ask career-related questions and receive
          intelligent job recommendations.
        </p>

      </div>

      <div className="assistant-input">

        <textarea
          rows={5}
          placeholder="Example: Suggest Python developer jobs for freshers..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={askAssistant}>
          Ask Assistant
        </button>

      </div>

      {loading && (
        <p className="assistant-loading">
          Thinking...
        </p>
      )}

      {!loading && answer && (

        <div className="assistant-answer">

          <h4 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "20px" }}>Career Recommendation</h4>

          <div className="formatted-response">
            {formatResponse(answer)}
          </div>

        </div>

      )}

    </div>
  );
}

export default CareerAssistant;