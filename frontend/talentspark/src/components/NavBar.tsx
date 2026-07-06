import "./NavBar.css";

interface NavBarProps {
  onLogout: () => void;
}

function NavBar({ onLogout }: NavBarProps) {
  return (
    <nav>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>

        <li style={{ marginLeft: "auto" }}>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;