import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./DiscoverJobs.css";

import SearchJobs from "./SearchJobs";
import CareerAssistant from "./CareerAssistant";
import ResumeAnalyzer from "./ResumeAnalyzer";
import JobMatching from "./JobMatching";

function DiscoverJobs() {
  return (
    <section className="discover-page" id="ai">

      <div className="discover-header">

        <h2>Discover Jobs</h2>

        <p>
          Explore jobs, analyze your resume,
          receive career guidance and find
          opportunities that match your profile.
        </p>

      </div>

      <div className="discover-tabs">
        <NavLink
          to="/discover-jobs/search"
          className={({ isActive }) => (isActive ? "active-tab" : "")}
        >
          Search Jobs
        </NavLink>
        <NavLink
          to="/discover-jobs/assistant"
          className={({ isActive }) => (isActive ? "active-tab" : "")}
        >
          Career Assistant
        </NavLink>
        <NavLink
          to="/discover-jobs/resume"
          className={({ isActive }) => (isActive ? "active-tab" : "")}
        >
          Resume Analyzer
        </NavLink>
        <NavLink
          to="/discover-jobs/matching"
          className={({ isActive }) => (isActive ? "active-tab" : "")}
        >
          Job Matching
        </NavLink>
      </div>

      <div className="discover-content">
        <Routes>
          <Route path="/" element={<Navigate to="search" replace />} />
          <Route path="search" element={<SearchJobs />} />
          <Route path="assistant" element={<CareerAssistant />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="matching" element={<JobMatching />} />
        </Routes>
      </div>

    </section>
  );
}

export default DiscoverJobs;