import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const predefinedUsers = [
  { email: "user1@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setMessage("");
    setIsLogin(!isLogin);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const userFound = predefinedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (userFound) {
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/home"); // Redirect to home page
      }, 1500);
    } else {
      setMessage("Invalid email or password.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Simple validation
    if (!registerEmail || !registerPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    setMessage("Registration successful! You can now login.");
    setRegisterEmail("");
    setRegisterPassword("");
    setTimeout(() => {
      setIsLogin(true);
      setMessage("");
    }, 2000);
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {isLogin ? "Login" : "Register"}
      </h2>

      {message && (
        <div
          style={{
            marginBottom: "15px",
            color: message.includes("success") ? "green" : "red",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="Enter email"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="Enter email"
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Password:</label>
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
      )}

      <p
        onClick={toggleForm}
        style={{
          marginTop: "20px",
          color: "#007bff",
          cursor: "pointer",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default AuthPage;
