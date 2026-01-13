import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";
import { useToast } from "../components/ToastContainer";
import "../scss/auth.scss";
import logo from "../images/LOGO UPDATED (7).png";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    setIsLoading(true);

    // Trim whitespace from inputs
    const trimmedUsername = formData.username.trim();
    const trimmedPassword = formData.password;

    console.log('Admin login attempt:', {
      username: trimmedUsername,
      usernameLength: trimmedUsername.length,
      hasPassword: !!trimmedPassword,
      passwordLength: trimmedPassword.length,
      apiBaseURL: import.meta.env.VITE_API_URL || 'https://gwbackend.onrender.com/api'
    });

    if (!trimmedUsername || !trimmedPassword) {
      showError('Username and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await adminAPI.login(
        trimmedUsername,
        trimmedPassword
      );

      console.log('Admin login response:', response);

      if (response && response.token && response.admin) {
        localStorage.setItem("adminToken", response.token);
        localStorage.setItem("admin", JSON.stringify(response.admin));
        navigate("/admin/panel", { replace: true });
      } else {
        console.error("Invalid response structure:", response);
        showError("Invalid response from server. Please try again.");
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      console.error("Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        config: {
          url: err?.config?.url,
          method: err?.config?.method,
          baseURL: err?.config?.baseURL,
        }
      });

      let errorMessage = "Failed to log in. Please try again.";

      if (err?.response) {
        // Server responded with an error
        const status = err.response.status;
        const serverError = err.response.data?.error || err.response.data?.message;
        
        if (status === 401) {
          errorMessage = serverError || "Invalid username or password. Please check your credentials.";
        } else if (status === 400) {
          errorMessage = serverError || "Invalid request. Please check your input.";
        } else if (status === 500) {
          errorMessage = serverError || "Server error. Please try again later.";
        } else if (serverError) {
          errorMessage = serverError;
        }
      } else if (err?.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection and try again.";
      } else if (err?.message) {
        // Error setting up the request
        errorMessage = err.message;
      }

      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="GeniusWav Logo" className="auth-logo" />
          <h1>Admin Login</h1>
          <p>Sign in to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
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
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
