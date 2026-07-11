import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "./SearchJobs.css";

type Job = {
  job_id: number;
  title: string;
  description: string;
  salary: number;
  score: number;
};

function SearchJobs() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (searchString: string) => {
    if (!searchString.trim()) {
      alert("Please enter a search query.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/rag/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchString,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();

      console.log("Search Response:", data);

      setJobs(data.results || []);

    } catch (error) {
      console.error(error);
      alert("Unable to search jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto search on mount if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, handleSearch]);

  return (
    <div className="search-jobs">

      <div className="search-header">

        <h3>Search Jobs</h3>

        <p>
          Search opportunities using skills,
          technologies, company names or job roles.
        </p>

      </div>

      <div className="search-box">

        <input
          type="text"
          placeholder="Example: Python Developer, React, FastAPI..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query);
            }
          }}
        />

        <button onClick={() => handleSearch(query)}>
          Search
        </button>

      </div>

      {loading && (
        <p className="loading-text">
          Searching jobs...
        </p>
      )}

      {searched && !loading && jobs.length === 0 && (
        <div className="empty-state">
          <p>No matching jobs found.</p>
        </div>
      )}

      <div className="job-results">

        {jobs.map((job) => (

          <div
            key={job.job_id}
            className="job-result-card"
          >

            <h3>{job.title}</h3>

            <p>{job.description}</p>

            <div className="job-info">

              <span>
                ₹ {job.salary} LPA
              </span>

              <span>
                {(job.score * 100).toFixed(1)}% Match
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default SearchJobs;