import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3050/elcyckel/v1/users");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();

      // Find the user with the provided email and password (this is a basic example)
      const authenticatedUser = data.find(
        (user) => user.email === email && user.password === password
      );

      if (authenticatedUser) {
        // Update state to store the authenticated user
        setUser(authenticatedUser);
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    }
  };

  const handleLogout = () => {
    // Implement logout logic here, e.g., clear user data from state
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <>
          <label>
            <input
              type="text"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              style={{ fontSize: "16px", padding: "8px", width: "200px", marginTop: "10px" }}
              />
          </label>
          <br />
          <label>
            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: "16px", padding: "8px", width: "200px", marginTop: "10px" }}
              />
          </label>
          <br />
          <button
        onClick={handleLogin}
        style={{
          fontSize: "18px",
          padding: "10px",
          width: "220px",
          marginTop: "15px",
          backgroundColor: "#1877f2",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Login
      </button>
        </>
      ) : (
        <div>
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          {/* Add more user details as needed */}
          <button onClick={handleLogout}>Logout</button>
          {/* Redirect to another site (replace 'https://example.com' with the actual URL) */}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
