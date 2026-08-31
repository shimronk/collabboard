import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import arrowIcon from "../assets/icons/arrow.png";
import hideIcon from "../assets/icons/hide.png";
import visibleIcon from "../assets/icons/visible.png";

const roleOptions = [
    "Team Member",
    "Team Lead",
    "Developer",
    "Tester",
    "UI/UX Designer",
];

function RegisterPage() {
    const navigate = useNavigate();
    const roleDropdownRef = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Team Member");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);


    const [isRoleOpen, setIsRoleOpen] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                roleDropdownRef.current &&
                !roleDropdownRef.current.contains(event.target)
            ) {
                setIsRoleOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setIsRoleOpen(false);
    };

    const handleRegister = (event) => {
        event.preventDefault();

        if (!name.trim()) {
            alert("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            alert("Please enter your email.");
            return;
        }

        if (!password) {
            alert("Please enter a password.");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!agreedToTerms) {
            alert("Please agree to the Terms & Conditions and Privacy Policy.");
            return;
        }

        const userProfile = {
            name: name.trim(),
            email: email.trim(),
            role,
            image: null,
        };

        localStorage.setItem(
            "collabboardProfile",
            JSON.stringify(userProfile)
        );

        alert("Account created successfully. Please login.");

        navigate("/login");
    };

    return (
        <div className="auth-page">
            <div className="auth-card register-card">
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
                        CREATE ACCOUNT
                    </p>

                    <h1>
                        Register
                    </h1>

                    <p>
                        Create an account to start managing your tasks.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleRegister}
                >
                    <div className="auth-form-group">
                        <label htmlFor="register-name">
                            Full Name
                        </label>

                        <input
                            id="register-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                        />
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="register-email">
                            Email Address
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />
                    </div>

                    <div
                        className="auth-form-group auth-role-group"
                        ref={roleDropdownRef}
                    >
                        <label>
                            Role
                        </label>

                        <div className="auth-role-selector">
                            <button
                                type="button"
                                className={`auth-role-select-button ${
                                    isRoleOpen
                                        ? "auth-role-select-open"
                                        : ""
                                }`}
                                onClick={() =>
                                    setIsRoleOpen(
                                        (current) => !current
                                    )
                                }
                            >
                                <span>
                                    {role}
                                </span>

                                <span
                                    className={`auth-role-arrow ${
                                        isRoleOpen
                                            ? "auth-role-arrow-open"
                                            : ""
                                    }`}
                                >
                                    ▼
                                </span>
                            </button>

                            {isRoleOpen && (
                                <div className="auth-role-options">
                                    {roleOptions.map((roleOption) => (
                                        <button
                                            key={roleOption}
                                            type="button"
                                            className={`auth-role-option ${
                                                role === roleOption
                                                    ? "auth-role-option-active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleRoleSelect(roleOption)
                                            }
                                        >
                                            {roleOption}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="auth-form-group">
                        <label htmlFor="register-password">
                            Password
                        </label>

                        <div className="password-input-wrapper">
                            <input
                                id="register-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Minimum 6 characters"
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

                    <div className="auth-form-group">
                        <label htmlFor="register-confirm-password">
                            Confirm Password
                        </label>

                        <div className="password-input-wrapper">
                            <input
                                id="register-confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter password again"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="password-toggle-button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (current) => !current
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                <img
                                    src={
                                        showConfirmPassword
                                            ? hideIcon
                                            : visibleIcon
                                    }
                                    alt=""
                                    className="password-toggle-icon"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="register-terms">
                        <label className="register-terms-label">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(event) =>
                                    setAgreedToTerms(event.target.checked)
                                }
                            />

                            <span>
                                I agree to the{" "}
                                <Link to="/terms">
                                    Terms & Conditions
                                </Link>
                                {" "}and{" "}
                                <Link to="/privacy">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="auth-primary-button"
                    >
                        Create Account
                    </button>
                </form>

                <div className="auth-footer">
                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>
                </div>

                <Link
                    to="/login"
                    className="auth-back-link"
                >
                    <img
                        src={arrowIcon}
                        alt=""
                        className="auth-back-icon"
                    />

                    <span>
                        Back to Login
                    </span>
                </Link>
            </div>
        </div>
    );
}

export default RegisterPage;
