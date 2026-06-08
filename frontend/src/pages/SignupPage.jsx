import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../styles/auth.css";

function SignupPage() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [formLoading, setFormLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const { user, signup } = useAuth();

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
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {

      setError(
        "Please fill in all fields."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }

    if (
      password.length < 6
    ) {

      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    setFormLoading(true);

    try {

      await signup(
        name,
        email,
        password
      );

    } catch (err) {

      setError(
        err?.message ||
        err?.error ||
        "Signup failed."
      );

      setFormLoading(false);
    }
  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1 className="auth-title">
          Create Account
        </h1>

        <p className="auth-subtitle">
          Join MiniStore today
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
              htmlFor="name"
            >
              Full Name
            </label>

            <input
              className="form-input"
              type="text"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              disabled={formLoading}
            />

          </div>

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

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>

            <input
              className="form-input"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              disabled={formLoading}
            />

            <label className="show-password">

              <input
                type="checkbox"
                checked={
                  showConfirmPassword
                }
                onChange={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              />

              Show Confirm Password

            </label>

          </div>

          <button
            className="auth-btn"
            type="submit"
            disabled={formLoading}
          >

            {formLoading
              ? "Creating Account..."
              : "Sign Up"}

          </button>

        </form>

        <div className="auth-footer">

          Already have an account?{" "}

          <Link to="/login">
            Log In
          </Link>

        </div>

      </div>

    </div>
  );
}

export default SignupPage;