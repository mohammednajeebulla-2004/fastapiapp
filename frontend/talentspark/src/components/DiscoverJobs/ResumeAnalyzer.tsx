import { useState } from "react";
import "./ResumeAnalyzer.css";

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      alert("Please paste your resume.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/rag/analyse-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resume_text: resumeText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Resume analysis failed.");
      }

      const data = await response.json();

      console.log("Resume Analysis:", data);

      setAnalysis(data.analysis || "No analysis available.");

    } catch (error) {
      console.error(error);
      setAnalysis("Unable to analyze the resume.");
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
    <div className="resume-analyzer">

      <div className="resume-header">

        <h3>Resume Analyzer</h3>

        <p>
          Paste your resume below to analyze your skills,
          experience and receive career recommendations.
        </p>

      </div>

      <div className="resume-upload">

        <textarea
          rows={12}
          placeholder="Paste your complete resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />

        <button onClick={analyzeResume}>
          Analyze Resume
        </button>

      </div>

      {loading && (
        <p className="loading-text">
          Analyzing resume...
        </p>
      )}

      {!loading && analysis && (

        <div className="resume-result">

          <h4 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "20px" }}>Resume Analysis</h4>

          <div className="formatted-response">
            {formatResponse(analysis)}
          </div>

        </div>

      )}

    </div>
  );
}

export default ResumeAnalyzer;