import React, { useState } from 'react'
import "../style/register.scss"
import FormGroup from '../components/FormGroup'
import AuthVisual from '../components/AuthVisual'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'
import useParallax from '../hooks/useParallax'

const UserIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

const Register = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate();
    const { user, loading, handleRegister } = useAuth();

    // If already authenticated, redirect to home without creating a history entry
    if (!loading && user) {
        return <Navigate to="/" replace />;
    }
    const pageRef = useParallax();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await handleRegister({ username, password, email });
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <main className="auth-page" ref={pageRef}>
            <AuthVisual
                brand="Moodify"
                tagline="Your mood. Your music. Your world."
                imageSrc="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG11c2ljfGVufDB8fDB8fHww"
            />

            <div className="cursor-glow" />

            <div className="auth-form-area auth-form-area--register">
                <img
                    src="https://images.unsplash.com/photo-1547357812-4a336d835928?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG11c2ljJTIwbWVufGVufDB8fDB8fHww"
                    alt=""
                    className="auth-form-area__image"
                    loading="eager"
                    draggable={false}
                />
                <div className="auth-register-panel">
                    <div className="auth-header auth-header--register">
                        <h1>Create <span className="gradient-text">your account</span></h1>
                        <p>Join Moodify and discover music that fits you</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form auth-form--register" onSubmit={handleSubmit}>
                        <FormGroup
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            label="Name"
                            placeholder="Enter your name"
                            icon={UserIcon}
                        />
                        <FormGroup
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email"
                            placeholder="Enter your email"
                            icon={MailIcon}
                        />
                        <FormGroup
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            placeholder="Create a password"
                            icon={LockIcon}
                        />
                        <button className="auth-submit auth-submit--register" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Register;