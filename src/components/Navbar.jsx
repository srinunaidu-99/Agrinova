import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sprout,
  LayoutDashboard,
  CloudSun,
  TrendingUp,
  Bot,
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  // Sync auth state if changed
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const notifications = [
    {
      id: 1,
      type: "alert",
      title: "Pest / Disease Watch",
      desc: "Humid conditions favor Early Blight in Tomatoes. Preventive bio-spray advised.",
      time: "25m ago",
      icon: <AlertTriangle size={16} color="#ef4444" />
    },
    {
      id: 2,
      type: "market",
      title: "Mandi Price Surge",
      desc: "Guntur Chili trading +5.4% higher at ₹18,400/Qtl.",
      time: "1h ago",
      icon: <ArrowUpRight size={16} color="#22c55e" />
    }
  ];

  const navLinks = [
    { path: "/", label: "Home", icon: <Sprout size={16} /> },
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { path: "/crops", label: "Crops", icon: <Sprout size={16} /> },
    { path: "/weather", label: "Weather", icon: <CloudSun size={16} /> },
    { path: "/market", label: "Market", icon: <TrendingUp size={16} /> },
    { path: "/assistant", label: "AI Copilot", icon: <Bot size={16} />, highlight: true },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="navbar-wrapper">
      <nav className="modern-navbar">
        {/* BRAND LOGO */}
        <Link to="/" className="brand-logo-link">
          <div className="brand-logo-badge">
            <span className="brand-icon">🌱</span>
          </div>
          <div className="brand-text-container">
            <span className="brand-name">
              Agri<span className="brand-highlight">Nova</span>
            </span>
            <span className="brand-badge-pill">AI 2.0</span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="desktop-nav-links">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-pill-item ${active ? "active" : ""} ${
                  item.highlight ? "highlight-pill" : ""
                }`}
              >
                <span className="nav-pill-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.highlight && <span className="nav-pill-sparkle">✨</span>}
                {active && <span className="active-glow-indicator" />}
              </Link>
            );
          })}
        </div>

        {/* RIGHT ACTION CONTROLS */}
        <div className="nav-right-controls">
          {/* QUICK WEATHER CHIP */}
          <Link to="/weather" className="weather-quick-chip" title="Local Live Weather">
            <span className="weather-icon">⛅</span>
            <span className="weather-temp">29°C</span>
            <span className="weather-loc">Narasaraopet</span>
          </Link>

          {/* NOTIFICATION CENTER */}
          <div className="notification-dropdown-anchor">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="icon-button notification-trigger-btn"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="notification-badge-dot">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-popover glass-panel">
                <div className="notification-popover-header">
                  <div>
                    <h4>Farm Alerts & Intel</h4>
                    <p>Live field warnings & market updates</p>
                  </div>
                  <button
                    onClick={() => {
                      setUnreadCount(0);
                      setShowNotifications(false);
                    }}
                    className="mark-read-btn"
                  >
                    Clear
                  </button>
                </div>
                <div className="notification-items-list">
                  {notifications.map((n) => (
                    <div key={n.id} className="notification-item">
                      <div className="notification-item-icon">{n.icon}</div>
                      <div className="notification-item-content">
                        <strong>{n.title}</strong>
                        <p>{n.desc}</p>
                        <small>{n.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AUTH USER BADGE / BUTTONS */}
          {token && user ? (
            <div className="user-profile-menu">
              <div className="user-chip">
                <div className="user-avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : "F"}
                </div>
                <div className="user-details">
                  <span className="user-name-label">{user.name || "Farmer"}</span>
                  <span className="user-status-tag">Verified Farmer</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="logout-action-btn"
                title="Sign out of AgriNova"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons-cluster">
              <Link to="/login" className="login-minimal-btn">
                Log In
              </Link>
              <Link to="/register" className="register-action-btn">
                <span>Join Free</span>
                <Sparkles size={14} />
              </Link>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* MOBILE EXPANDED MENU */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer glass-panel">
          <div className="mobile-links-grid">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`mobile-nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                <span className="mobile-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            {token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="mobile-nav-item mobile-logout"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="mobile-auth-row">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="login-minimal-btn"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="register-action-btn"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}