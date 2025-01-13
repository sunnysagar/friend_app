import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setIsAuthenticated(true); // If token is valid, set as authenticated
        }
      } catch (error) {
        console.error("Invalid or expired token. Redirecting to login.");
        localStorage.removeItem("token"); // Remove invalid token
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Stop loading after validation attempt
      }
    };

    validateToken();
  }, []); // Runs once on mount

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
