import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Predefined users and style configuration
const predefinedUsers = [
  { email: "user1@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
];

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  message: {
    marginBottom: "15px",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
  },
  toggleText: {
    marginTop: "20px",
    color: "#007bff",
    cursor: "pointer",
    textAlign: "center",
    userSelect: "none",
  },
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [message, setMessage] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const toggleForm = () => {
    setMessage("");
    setIsLogin(!isLogin);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      const userFound = [...predefinedUsers, ...registeredUsers].find(
        (user) => user.email === email && user.password === password
      );

      if (userFound) {
        setMessage("Login successful! Redirecting...");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        setMessage("Invalid email or password.");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      if (!registerEmail || !registerPassword) {
        setMessage("Please fill all fields.");
        setIsSubmitting(false);
        return;
      }

      if (!isValidEmail(registerEmail)) {
        setMessage("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }

      if (registerPassword.length < 6) {
        setMessage("Password must be at least 6 characters.");
        setIsSubmitting(false);
        return;
      }

      const emailExists = [...predefinedUsers, ...registeredUsers].some(
        (user) => user.email === registerEmail
      );

      if (emailExists) {
        setMessage("Email already registered.");
        setIsSubmitting(false);
        return;
      }

      setRegisteredUsers((prev) => [
        ...prev,
        { email: registerEmail, password: registerPassword },
      ]);
      setMessage("Registration successful! You can now login.");
      setRegisterEmail("");
      setRegisterPassword("");
      setIsSubmitting(false);

      setTimeout(() => {
        setIsLogin(true);
        setMessage("");
      }, 2000);
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>{isLogin ? "Login" : "Register"}</h2>

      {message && (
        <div
          style={{
            ...styles.message,
            color: message.includes("success") ? "#28a745" : "#dc3545",
          }}
        >
          {message}
        </div>
      )}

      {isLogin ? (
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label htmlFor="login-email">Email:</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter email"
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="login-password">Password:</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter password"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: isSubmitting ? "#6c757d" : "#007bff",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Login"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label htmlFor="register-email">Email:</label>
            <input
              id="register-email"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter email"
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="register-password">Password:</label>
            <input
              id="register-password"
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter password (min 6 characters)"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: isSubmitting ? "#6c757d" : "#28a745",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Register"}
          </button>
        </form>
      )}

      <p onClick={toggleForm} style={styles.toggleText}>
        {isLogin
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default AuthPage;