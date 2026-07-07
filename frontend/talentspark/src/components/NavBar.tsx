import { useState } from "react";
import "./NavBar.css";
import { FaBriefcase, FaBuilding, FaRobot, FaSignOutAlt, FaBars, FaTimes, FaUser } from "react-icons/fa";

interface NavBarProps {
  onLogout: () => void;
  role?: string | null;
}

export default function NavBar({ onLogout, role }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getRoleLabel = (r?: string | null) => {
    if (!r) return "";
    if (r === "admin") return "Admin";
    if (r === "hr") return "HR Portal";
    return "Candidate";
  };

  return (
    <nav className="navbar">
      <div className="logo">
        Talent<span>Spark</span>
      </div>

      <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`nav-links ${isOpen ? "active" : ""}`}>
        <li>
          <a href="#" onClick={() => setIsOpen(false)}>
            Home
          </a>
        </li>

        <li>
          <a href="#companies" onClick={() => setIsOpen(false)}>
            <FaBuilding />
            Companies
          </a>
        </li>

        <li>
          <a href="#jobs" onClick={() => setIsOpen(false)}>
            <FaBriefcase />
            Jobs
          </a>
        </li>

        <li>
          <a href="#ai" onClick={() => setIsOpen(false)}>
            <FaRobot />
            AI Assistant
          </a>
        </li>

        {role && (
          <li className="mobile-only">
            <span className={`role-badge ${role}`}>
              <FaUser /> {getRoleLabel(role)}
            </span>
          </li>
        )}

        <li className="mobile-only">
          <button className="logout-btn mobile-logout-btn" onClick={() => { setIsOpen(false); onLogout(); }}>
            <FaSignOutAlt />
            Logout
          </button>
        </li>
      </ul>

      <div className="nav-actions">
        {role && (
          <span className={`role-badge desktop-only ${role}`}>
            <FaUser /> {getRoleLabel(role)}
          </span>
        )}
        <button className="logout-btn desktop-only" onClick={onLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </nav>
  );
}