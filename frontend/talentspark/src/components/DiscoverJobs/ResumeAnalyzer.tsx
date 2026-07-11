import { useState } from "react";
import "./ResumeAnalyzer.css";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/rag/analyse-resume`,
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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || "Resume analysis failed.");
      }

      const data = await response.json();

      console.log("Resume Analysis:", data);

      setAnalysis(data.analysis || "No analysis available.");

    } catch (error: any) {
      console.error(error);
      setAnalysis(error.message || "Unable to analyze the resume.");
    } finally {
      setLoading(false);
    }
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {analysis}
            </ReactMarkdown>
          </div>

        </div>

      )}

    </div>
  );
}

export default ResumeAnalyzer;