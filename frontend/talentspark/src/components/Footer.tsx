import "./Footer.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Brand column */}
        <div className="footer-col">
          <h2 className="footer-brand">
            Talent<span>Spark</span>
          </h2>
          <p className="footer-tagline">
            AI-Powered Job Portal built with FastAPI, React, Qdrant and Groq AI.
            Connecting talent with opportunity.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="GitHub"><FaGithub /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>

        {/* Quick Links column */}
        <div className="footer-col">
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-link-list">
            <li><a href="#">Home</a></li>
            <li><a href="#companies">Companies</a></li>
            <li><a href="#jobs">Jobs</a></li>
            <li><a href="#ai">Discover Jobs</a></li>
          </ul>
        </div>

        {/* Contact Support column */}
        <div className="footer-col">
          <h3 className="footer-col-title">Contact Support</h3>
          <ul className="footer-contact-list">
            <li>
              <FaEnvelope className="contact-icon" />
              <span>support@talentspark.ai</span>
            </li>
            <li>
              <FaPhone className="contact-icon" />
              <span>+91 98765 43210</span>
            </li>
            <li>
              <FaMapMarkerAlt className="contact-icon" />
              <span>Bengaluru, India</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 TalentSpark. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;