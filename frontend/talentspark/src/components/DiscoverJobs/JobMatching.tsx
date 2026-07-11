import { useState } from "react";
import "./JobMatching.css";

interface MatchJob {
  job_id: number;
  title: string;
  description: string;
  salary: number;
  match_score: number;
}

function JobMatching() {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [jobs, setJobs] = useState<MatchJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const findMatches = async () => {
    if (!skills.trim()) {
      alert("Please enter your skills.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/rag/job-match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills,
            experience,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch matching jobs.");
      }

      const data = await response.json();

      console.log("Job Match:", data);

      setJobs(data.matches || []);

    } catch (error) {
      console.error(error);
      alert("Unable to find matching jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-matching">

      <div className="matching-header">
        <h3>Job Matching</h3>

        <p>
          Find jobs that closely match your
          skills and experience.
        </p>
      </div>

      <div className="matching-form">

        <textarea
          rows={4}
          placeholder="Example: Python, FastAPI, React, SQL"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          type="text"
          placeholder="Experience (Example: 2 Years)"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <button onClick={findMatches}>
          Find Matching Jobs
        </button>

      </div>

      {loading && (
        <p className="loading-text">
          Finding matching jobs...
        </p>
      )}

      {searched && !loading && jobs.length === 0 && (
        <div className="empty-state">
          <p>No matching jobs found.</p>
        </div>
      )}

      <div className="matching-results">

        {jobs.map((job) => (

          <div
            className="match-card"
            key={job.job_id}
          >

            <h3>{job.title}</h3>

            <p>{job.description}</p>

            <div className="match-footer">

              <span>
                ₹ {job.salary}
              </span>

              <span className="match-score">
                {(job.match_score ?? 0).toFixed(1)}%
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default JobMatching;