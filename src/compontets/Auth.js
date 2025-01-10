import React, { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (type) => {
    const endpoint = type === "signup" ? "signup" : "login";
    try {
      const { data } = await axios.post(`http://localhost:5000/api/users/${endpoint}`, {
        username,
        password,
      });
      if (type === "login") localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  return (
    <div>
      <h1>Auth Page</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => handleAuth("signup")}>Sign Up</button>
      <button onClick={() => handleAuth("login")}>Login</button>
    </div>
  );
};

export default Auth;
