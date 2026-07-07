import "./NavBar.css";
import { FaBriefcase, FaBuilding, FaRobot, FaSignOutAlt } from "react-icons/fa";

interface NavBarProps {
  onLogout: () => void;
}

export default function NavBar({ onLogout }: NavBarProps) {
  return (
    <nav className="navbar">
      <div className="logo">
        Talent<span>Spark</span>
      </div>

      <ul className="nav-links">
        <li>
          <a href="#">
            Home
          </a>
        </li>

        <li>
          <a href="#companies">
            <FaBuilding />
            Companies
          </a>
        </li>

        <li>
          <a href="#jobs">
            <FaBriefcase />
            Jobs
          </a>
        </li>

        <li>
          <a href="#ai">
            <FaRobot />
            AI Assistant
          </a>
        </li>
      </ul>

      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </nav>
  );
}