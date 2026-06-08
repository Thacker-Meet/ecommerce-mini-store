import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/auth.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const { user, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !email.trim() ||
      !password.trim()
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    setFormLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err?.message ||
        err?.error ||
        "Invalid credentials."
      );
      setFormLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="auth-title">
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Log in to your MiniStore account
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="email"
            >
              Email Address
            </label>

            <input
              className="form-input"
              type="email"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              disabled={formLoading}
            />

          </div>

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="password"
            >
              Password
            </label>

            <input
              className="form-input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              disabled={formLoading}
            />

            <label className="show-password">

              <input
                type="checkbox"
                checked={showPassword}
                onChange={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              />

              Show Password

            </label>

          </div>

          <button
            className="auth-btn"
            type="submit"
            disabled={formLoading}
          >

            {formLoading
              ? "Logging in..."
              : "Log In"}

          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;