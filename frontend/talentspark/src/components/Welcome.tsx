import "./Welcome.css";

export default function Welcome() {
  return (
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

        <div className="search-box">

          <input
            type="text"
            placeholder="Search jobs, skills, or companies..."
          />

          <button>
            Search
          </button>

        </div>

      </div>

    </section>
  );
}