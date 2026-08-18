import React, { useState } from 'react'
import "../style/login.scss"
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Login = () => {
    const { loading, handleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await handleLogin({ email, password });
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <main className='login-page'>
            <div className="form-container">
                <h1>Login</h1>
                {error && <p style={{color: "#ff4444"}}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <FormGroup
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email" placeholder="Enter your email" />
                    <FormGroup
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password" placeholder="Enter your password" />
                    <button className='button' type='submit' disabled={loading}>Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register here.</Link></p>
            </div>
        </main>
    )
}

export default Login;
