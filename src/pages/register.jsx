import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  User,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "Narasaraopet",
    language: "English",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDemoLogin = () => {
    const demoUser = {
      _id: "demo-user-123",
      name: "Ramesh Sharma",
      email: "ramesh.farmer@agrinova.in",
      location: "Narasaraopet, AP",
      role: "Lead Agronomist & Farmer"
    };
    localStorage.setItem("token", "demo-jwt-token-2026");
    localStorage.setItem("user", JSON.stringify(demoUser));
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      console.warn("Backend registration error:", err.message);
      setError(err.message + " (Or use 1-Click Demo Login to explore immediately)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-fullscreen-container">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />

      <div className="auth-card-modern glass-panel animate-scaleUp">
        <div className="auth-brand-center">
          <Link to="/" className="auth-logo-badge">
            <span>🌱</span>
          </Link>
          <h2>Join AgriNova 2.0</h2>
          <p>Register your farm and start optimizing yields</p>
        </div>

        {/* 1-CLICK INSTANT DEMO LOGIN BUTTON */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="btn-demo-quick-login"
        >
          <div className="demo-btn-content">
            <Zap size={18} color="#a3e635" />
            <div>
              <strong>⚡ 1-Click Demo Explorer</strong>
              <small>Skip typing & test full platform immediately</small>
            </div>
          </div>
          <ArrowRight size={16} />
        </button>

        <div className="auth-divider">
          <span>OR CREATE NEW ACCOUNT</span>
        </div>

        {error && (
          <div className="auth-error-chip animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="auth-input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-icon-wrap">
              <User size={18} color="#64748b" />
              <input
                id="name"
                type="text"
                name="name"
                placeholder="e.g. Ramesh Sharma"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={18} color="#64748b" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="location">Farm Location / Mandi Region</label>
            <div className="input-icon-wrap">
              <MapPin size={18} color="#64748b" />
              <input
                id="location"
                type="text"
                name="location"
                placeholder="e.g. Narasaraopet, Guntur, Hyderabad"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrap">
              <Lock size={18} color="#64748b" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-action btn-auth-submit"
          >
            <span>{loading ? "Creating Account..." : "Create Free Farm Account"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-links">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-accent-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}