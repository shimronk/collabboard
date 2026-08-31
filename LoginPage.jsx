import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import hideIcon from "../assets/icons/hide.png";
import visibleIcon from "../assets/icons/visible.png";
import { loginUser } from "../api/authApi";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
        alert("Please enter your email.");
        return;
    }

    if (!password.trim()) {
        alert("Please enter your password.");
        return;
    }

    try {
        const result = await loginUser(
            email.trim(),
            password
        );

        sessionStorage.setItem(
            "collabboardToken",
            result.token
        );

        sessionStorage.setItem(
            "collabboardEmail",
            result.user.email
        );

        sessionStorage.setItem(
            "collabboardUserId",
            String(result.user.id)
        );

        sessionStorage.setItem(
            "collabboardRole",
            result.user.role
        );

        sessionStorage.setItem(
            "collabboardLoggedIn",
            "true"
        );

        navigate("/board");

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        alert(
            error.message ||
            "Invalid email or password."
        );
    }
};

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link
                    to="/"
                    className="auth-logo"
                >
                    <span className="logo-icon">
                        ?
                    </span>

                    <span>
                        CollabBoard
                    </span>
                </Link>

                <div className="auth-header">
                    <p className="page-label">
                        WELCOME BACK
                    </p>

                    <h1>
                        Login
                    </h1>

                    <p>
                        Sign in to access your development board.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="auth-form-group">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() =>
                                    setShowPassword(
                                        (current) => !current
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                <img
                                    src={
                                        showPassword
                                            ? hideIcon
                                            : visibleIcon
                                    }
                                    alt=""
                                    className="password-toggle-icon"
                                />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p
                            className="auth-error-message"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-primary-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Register
                    </Link>
                </div>

                <Link
                    to="/"
                    className="auth-back-link"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default LoginPage;
