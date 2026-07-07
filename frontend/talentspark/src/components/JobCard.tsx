import "./JobCard.css";

function JobCard() {
  return (
    <div className="job-section">

      <h2 className="job-title">
        Featured Jobs
      </h2>

      <div className="job-card">

        <div className="job-header">
          <h3>Software Engineer</h3>
          <span className="salary">₹5 LPA</span>
        </div>

        <p className="company">
          🏢 Google
        </p>

        <p className="location">
          📍 Bangalore
        </p>

        <div className="skills">

          <span>Python</span>

          <span>React</span>

          <span>FastAPI</span>

        </div>

        <div className="job-buttons">

          <button className="view-btn">
            View Details
          </button>

          <button className="apply-btn">
            Apply
          </button>

        </div>

      </div>

    </div>
  );
}

export default JobCard;