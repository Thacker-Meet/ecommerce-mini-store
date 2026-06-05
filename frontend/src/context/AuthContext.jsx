import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged in user profile using the JWT token
  const fetchUser = async () => {
    try {
      const response = await API.get("/auth/me");
      setUser(response.data);
    } catch (err) {
      console.error("AuthContext: Failed to fetch user profile", err);
      // Clean up token if it's invalid or expired
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // Run on mount to check if token exists and fetch user
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await fetchUser();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem("token", token);
      
      // Fetch user profile info
      await fetchUser();
      
      return response.data;
    } catch (err) {
      // Propagate the specific backend error message
      throw err.response?.data || { message: "An error occurred during login" };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const response = await API.post("/auth/signup", { name, email, password });
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem("token", token);
      
      // Fetch user profile info
      await fetchUser();
      
      return response.data;
    } catch (err) {
      // Propagate the specific backend error message
      throw err.response?.data || { message: "An error occurred during signup" };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
