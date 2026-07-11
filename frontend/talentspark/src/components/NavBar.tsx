import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import {
  FaBriefcase,
  FaBuilding,
  FaRobot,
  FaSignOutAlt,
  FaUser,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";

interface NavBarProps {
  onLogout: () => void;
  role?: string | null;
}

export default function NavBar({ onLogout, role }: NavBarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (next) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }
  };

  const getRoleLabel = (r?: string | null) => {
    if (!r) return "Guest";
    if (r === "admin") return "Admin";
    if (r === "hr") return "HR Portal";
    return "Candidate";
  };

  const navItems = [
    { to: "/", icon: <FaHome />, label: "Home" },
    { to: "/companies", icon: <FaBuilding />, label: "Companies" },
    { to: "/jobs", icon: <FaBriefcase />, label: "Jobs" },
    { to: "/discover-jobs", icon: <FaRobot />, label: "Discover Jobs" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      {/* Toggle button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <FaBars /> : <FaTimes />}
      </button>

      {/* Logo */}
      <div className="sidebar-logo">
        {collapsed ? (
          <span className="logo-icon">⚡</span>
        ) : (
          <span className="logo-full">
            Talent<span>Spark</span>
          </span>
        )}
      </div>

      {/* User badge */}
      {role && (
        <div className={`sidebar-user-badge ${role}`}>
          <FaUser className="badge-icon" />
          {!collapsed && <span>{getRoleLabel(role)}</span>}
        </div>
      )}

      {/* Nav links */}
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                end={item.to === "/"}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {!collapsed && (
                  <span className="sidebar-link-label">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Spacer pushes logout to bottom */}
      <div className="sidebar-spacer" />

      {/* Logout */}
      <button className="sidebar-logout" onClick={onLogout}>
        <FaSignOutAlt className="sidebar-link-icon" />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}