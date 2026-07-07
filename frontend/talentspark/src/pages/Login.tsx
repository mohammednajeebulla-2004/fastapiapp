import { useState } from "react";
import { login } from "../Services/AuthService";
import "./Login.css";

type Props = {
  onLogin: (token: string) => void;
  onSwitchToRegister: () => void;
};

function Login({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });

      localStorage.setItem("token", response.access_token);

      onLogin(response.access_token);
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>TalentSpark</h1>

        <p>AI Powered Job Portal</p>

        <form onSubmit={handleSubmit}>

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

          <button type="submit">
            Login
          </button>

        </form>

        <div className="register-link">

          Don't have an account?

          <span onClick={onSwitchToRegister}>
            Register
          </span>

        </div>

      </div>

    </div>
  );
}

export default Login;