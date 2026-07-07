import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <h2>TalentSpark</h2>

        <p>
          AI Powered Job Portal using FastAPI, React,
          Qdrant and Groq AI
        </p>

        <div className="footer-links">

          <a href="#">Home</a>

          <a href="#">Companies</a>

          <a href="#">Jobs</a>

          <a href="#">AI Assistant</a>

        </div>

        <hr />

        <p className="copyright">
          © 2026 TalentSpark. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;