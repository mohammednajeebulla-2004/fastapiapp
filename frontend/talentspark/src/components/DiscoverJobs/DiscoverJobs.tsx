import { useState } from "react";
import "./DiscoverJobs.css";

import SearchJobs from "./SearchJobs";
import CareerAssistant from "./CareerAssistant";
import ResumeAnalyzer from "./ResumeAnalyzer";
import JobMatching from "./JobMatching";

type Tab =
  | "search"
  | "assistant"
  | "resume"
  | "matching";

function DiscoverJobs() {
  const [activeTab, setActiveTab] =
    useState<Tab>("search");

  return (
    <section className="discover-page">

      <div className="discover-header">

        <h2>Discover Jobs</h2>

        <p>
          Explore jobs, analyze your resume,
          receive career guidance and find
          opportunities that match your profile.
        </p>

      </div>

      <div className="discover-tabs">

        <button
          className={
            activeTab === "search"
              ? "active-tab"
              : ""
          }
          onClick={() => setActiveTab("search")}
        >
          Search Jobs
        </button>

        <button
          className={
            activeTab === "assistant"
              ? "active-tab"
              : ""
          }
          onClick={() => setActiveTab("assistant")}
        >
          Career Assistant
        </button>

        <button
          className={
            activeTab === "resume"
              ? "active-tab"
              : ""
          }
          onClick={() => setActiveTab("resume")}
        >
          Resume Analyzer
        </button>

        <button
          className={
            activeTab === "matching"
              ? "active-tab"
              : ""
          }
          onClick={() => setActiveTab("matching")}
        >
          Job Matching
        </button>

      </div>

      <div className="discover-content">

        {activeTab === "search" && (
          <SearchJobs />
        )}

        {activeTab === "assistant" && (
          <CareerAssistant />
        )}

        {activeTab === "resume" && (
          <ResumeAnalyzer />
        )}

        {activeTab === "matching" && (
          <JobMatching />
        )}

      </div>

    </section>
  );
}

export default DiscoverJobs;