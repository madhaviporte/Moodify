import React, { useState } from "react";
import "../style/login.scss";
import FormGroup from "../components/FormGroup";
import AuthVisual from "../components/AuthVisual";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import useParallax from "../hooks/useParallax";

// SVG icons for form fields
const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);

const LockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const pageRef = useParallax();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await handleLogin({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }    return (
      <main className="auth-page" ref={pageRef}>
      {/* LEFT — Cinematic music visual */}
      <AuthVisual
        brand="Moodify"
        tagline="Music that matches your mood."
      />

      {/* Cursor glow */}
      <div className="cursor-glow" />

      {/* RIGHT — Login panel */}
      <div className="auth-form-area auth-form-area--login">
        <div className="auth-login-panel">
          <div className="auth-header auth-header--login">
            <h1>Welcome <span className="gradient-text">back</span></h1>
            <p>Sign in to continue your Moodify journey</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form auth-form--login" onSubmit={handleSubmit}>
            <FormGroup
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="Enter your email"
              icon={MailIcon}
            />

            <div className="form-group">
              <div className="auth-row">
                <label htmlFor="Password">Password</label>
                <a href="#" className="auth-forgot" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
              <div className="input-wrap">
                <span className="input-icon">{LockIcon}</span>
                <input
                  type="password"
                  id="Password"
                  name="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button className="auth-submit auth-submit--login" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
