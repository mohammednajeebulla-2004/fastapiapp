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
        "http://127.0.0.1:8000/rag/ask",
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
        throw new Error("Request failed");
      }

      const data = await response.json();

      console.log("Career Assistant:", data);

      setAnswer(data.answer);

    } catch (error) {
      console.error(error);
      setAnswer("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
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

          <h4>Career Recommendation</h4>

          <p>{answer}</p>

        </div>

      )}

    </div>
  );
}

export default CareerAssistant;