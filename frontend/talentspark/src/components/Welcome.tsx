import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaRocket, FaBuilding, FaUserTie } from "react-icons/fa";
import "./Welcome.css";

export default function Welcome() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    
    if (!query) return;

    if (query === "companies" || query === "company") {
      navigate("/companies");
    } else if (query === "jobs" || query === "job") {
      navigate("/jobs");
    } else if (query === "home") {
      navigate("/");
    } else {
      navigate(`/discover-jobs/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Find Your <span>Dream Job</span>
          </h1>
          <p>
            TalentSpark is an AI-powered Job Portal that helps you discover
            companies, search jobs semantically, and get personalized
            recommendations using Artificial Intelligence.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="primary-btn">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaRocket className="feature-icon" />
            </div>
            <h3>AI-Powered Search</h3>
            <p>Our semantic search engine understands the context of your query, matching you with the perfect role instantly.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaBuilding className="feature-icon" />
            </div>
            <h3>Top Companies</h3>
            <p>Connect with industry leaders and innovative startups looking for top talent across the globe.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FaUserTie className="feature-icon" />
            </div>
            <h3>Career Assistant</h3>
            <p>Get personalized career advice, resume analysis, and interview preparation from our intelligent AI.</p>
          </div>
        </div>
      </section>
    </div>
  );
}