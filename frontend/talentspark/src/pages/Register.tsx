import { useState } from "react";
import { register } from "../Services/AuthService";
import "./Register.css";

type Props = {
  onSwitchToLogin: () => void;
};

function Register({ onSwitchToLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register({
        name,
        email,
        password,
        role,
      });

      alert("Registration successful! Please login.");
      onSwitchToLogin();
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>TalentSpark</h1>
        <p>Create your account</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        <div className="login-link">
          Already have an account?
          <span onClick={onSwitchToLogin}>
            Login
          </span>
        </div>

      </div>
    </div>
  );
}

export default Register;