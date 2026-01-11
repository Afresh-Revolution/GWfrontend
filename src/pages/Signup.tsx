import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ToastContainer";
import "../scss/auth.scss";
import logo from "../images/LOGO UPDATED (7).png";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signup(
        formData.fullName,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined;
      showError(errorMessage || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url("${logo}")`,
      }}
    >
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="GeniusWav Logo" className="auth-logo" />
          <h2>Create your account</h2>
          <p>
            Or{" "}
            <Link to="/login" className="auth-link">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-wrapper">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-wrapper password-wrapper">
              <label htmlFor="password">Password</label>
              <div className="password-container">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {formData.password && formData.password.length < 6 && (
                <span className="input-helper">
                  Password must be at least 6 characters
                </span>
              )}
            </div>

            <div className="input-wrapper password-wrapper">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-container">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <span className="input-error">Passwords do not match</span>
                )}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
