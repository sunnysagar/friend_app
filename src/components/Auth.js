import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style.css";

const Auth = () => {
  const [authType, setAuthType] = useState("login"); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "", // Reintroduce confirmPassword field if needed
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validate token and redirect if invalid
  const validateToken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          navigate("/dashboard"); // Redirect to dashboard if token is valid
        }
      } catch (err) {
        console.error("Invalid token or session expired.");
        localStorage.removeItem("token"); // Clear invalid token
      }
    }
  };

  // Perform token validation on component mount
  useEffect(() => {
    validateToken();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
    setError("");
    
    // Validate passwords match for signup
    if (authType === "signup" && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const endpoint = authType === "signup" ? "signup" : "login";
      const { data } = await axios.post(
        `http://localhost:5000/api/users/${endpoint}`,
        authType === "signup"
          ? {
              firstname: formData.firstname,
              lastname: formData.lastname,
              phone: formData.phone,
              email: formData.email,
              username: formData.username,
              password: formData.password,
            }
          : {
              username: formData.username,
              password: formData.password,
            }
      );

      if (authType === "login") {
        localStorage.setItem("token", data.token);
        console.log("Stored token:", data.token); // Log the token to verify
        navigate("/dashboard"); // Redirect to dashboard after login
      } else {
        alert("Signup successful! Please log in.");
        setAuthType("login"); // Switch to login view after successful signup
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="auth-main-container">
      <div className="auth-container">
      <h1>{authType === "signup" ? "Sign Up" : "Login"}</h1>

      {/* Conditional rendering for signup fields */}
      {authType === "signup" && (
        <>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </>
      )}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />

      {authType === "signup" && (
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      <button onClick={handleAuth}>
        {authType === "signup" ? "Sign Up" : "Login"}
      </button>

      <p>
        {authType === "signup" ? "Already have an account?" : "Don't have an account?"}
        <span
          className="auth-toggle"
          onClick={() => setAuthType(authType === "signup" ? "login" : "signup")}
        >
          {authType === "signup" ? " Login" : " Sign Up"}
        </span>
      </p>
    </div>
    </div>
    
  );
};

export default Auth;
