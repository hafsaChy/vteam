// Login.js
import React, { useState, useEffect } from "react";
import UserAccountInfo from "./user";
import AdminAccountInfo from "./admin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { email, role, username, user_id, balance, current_balance } = JSON.parse(atob(token));
        setUser({ email, role, username, user_id, balance, current_balance });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3050/elcyckel/v1/users");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const authenticatedUser = data.find((u) => u.email === email && u.password === password);

      if (authenticatedUser) {
        const { email, role, username, user_id, balance, current_balance } = authenticatedUser;
        const token = btoa(JSON.stringify({ email, role, username, user_id, balance, current_balance }));

        setUser({ email, role, username, user_id, balance, current_balance });
        setError(null);
        localStorage.setItem("token", token);
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const GithubLoginButton = () => (
    <button onClick={() => window.location.href = 'http://localhost:3050/auth/github'} style={buttonStyle}>
      Login with GitHub
    </button>
  );

  return (
    <div className="flex-container">
      <div className="home-body-container">
        {!user ? (
          <>
            <LoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
            <GithubLoginButton />
          </>
        ) : (
          <AccountInfo user={user} handleLogout={handleLogout} />
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div className="footer">
        {/* Your footer content */}
      </div>
    </div>
  );
};

const LoginForm = ({ email, password, setEmail, setPassword, handleLogin }) => (
  <>
    <label>
      <input
        type="text"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
    </label>
    <br />
    <label>
      <input
        type="password"
        value={password}
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
    </label>
    <br />
    <button onClick={handleLogin} style={buttonStyle}>
      Login
    </button>
  </>
);

const AccountInfo = ({ user, handleLogout }) => (
  <>
    {user.role === "user" && <UserAccountInfo user={user} handleLogout={handleLogout} />}
    {user.role === "admin" && <AdminAccountInfo user={user} handleLogout={handleLogout} />}
  </>
);

const inputStyle = {
  fontSize: "16px",
  padding: "8px",
  width: "200px",
  marginTop: "10px",
};

const buttonStyle = {
  fontSize: "18px",
  padding: "10px",
  width: "220px",
  marginTop: "15px",
  backgroundColor: "#1877f2",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default Login;
