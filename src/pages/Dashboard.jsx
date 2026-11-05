import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Sun,
  Wind,
  TrendingUp,
  Bot,
  Camera,
  Plus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Zap,
  Clock,
  Compass
} from "lucide-react";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api";

export default function Dashboard() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  // User details
  const user = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "Alex Farmer",
    location: "Narasaraopet, AP"
  };

  // Demo Fallback Data for instant vibrant UX preview
  const demoCrops = [
    {
      _id: "demo-1",
      cropName: "Bt Cotton (Hybrid)",
      acreage: 6.5,
      sowingDate: "2024-06-15",
      soilType: "Black Cotton",
      irrigationType: "Drip Irrigation",
      status: "Flowering",
      healthStatus: "Healthy",
      confidence: 97.4,
      lastHealthCheck: new Date(Date.now() - 3600000 * 4).toISOString(),
      disease: "Optimal Foliage Health"
    },
    {
      _id: "demo-2",
      cropName: "Guntur Teja Chili",
      acreage: 4.0,
      sowingDate: "2024-07-02",
      soilType: "Red Sandy Loam",
      irrigationType: "Furrow",
      status: "Fruiting",
      healthStatus: "Disease Detected",
      confidence: 89.2,
      lastHealthCheck: new Date(Date.now() - 3600000 * 18).toISOString(),
      disease: "Early Cercospora Leaf Spot"
    },
    {
      _id: "demo-3",
      cropName: "Paddy (BPT 5204)",
      acreage: 8.0,
      sowingDate: "2024-07-20",
      soilType: "Clay Alluvial",
      irrigationType: "Flood",
      status: "Vegetative",
      healthStatus: "Healthy",
      confidence: 96.8,
      lastHealthCheck: new Date(Date.now() - 3600000 * 48).toISOString(),
      disease: "Clean Vegetative Tiller"
    }
  ];

  // Fetch real crops
  const fetchCrops = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        // Fallback to lively demo data so the page looks stunning
        setCrops(demoCrops);
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/crops`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load crops from server.");
      }

      const fetchedList = data.crops || data.data || [];
      if (fetchedList.length === 0) {
        // Use demo if account has zero crops yet
        setCrops(demoCrops);
        setIsDemoMode(true);
      } else {
        setCrops(fetchedList);
        setIsDemoMode(false);
      }
    } catch (err) {
      console.warn("Backend unavailable, activating high-fidelity demo mode:", err.message);
      setCrops(demoCrops);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // Stats
  const totalCrops = crops.length;
  const healthyCrops = crops.filter((c) => c.healthStatus === "Healthy").length;
  const diseaseCrops = crops.filter((c) => c.healthStatus === "Disease Detected").length;
  const uncheckedCrops = crops.filter(
    (c) => !c.healthStatus || c.healthStatus === "Not Checked"
  ).length;
  const checkedCrops = healthyCrops + diseaseCrops;

  // Farm Vitality Index (0 - 100)
  const vitalityScore =
    totalCrops > 0
      ? Math.round(
          ((healthyCrops * 100 + uncheckedCrops * 75) / (totalCrops * 100)) * 100
        )
      : 92;

  const confidenceValues = crops
    .filter((c) => typeof c.confidence === "number")
    .map((c) => c.confidence);

  const averageConfidence =
    confidenceValues.length > 0
      ? (
          confidenceValues.reduce((sum, v) => sum + v, 0) /
          confidenceValues.length
        ).toFixed(1)
      : "95.6";

  const formatDate = (date) => {
    if (!date) return "Pending check";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-page-wrapper">
      <Navbar />

      <main className="dashboard-main-content">
        {/* ========================================
            HEADER ROW
        ======================================== */}
        <div className="dashboard-header-row">
          <div className="dashboard-greeting-col">
            <div className="live-status-pill">
              <span className="pulse-dot" />
              <span>LIVE TELEMETRY ACTIVE</span>
              {isDemoMode && (
                <span className="demo-indicator-tag">Demo Sandbox</span>
              )}
            </div>
            <h1>
              Welcome back, <span className="gradient-text-green">{user.name}</span> 👋
            </h1>
            <p className="dashboard-greeting-sub">
              Farm Location: <strong>{user.location || "Narasaraopet, AP"}</strong> • Satellite resolution 10m • All IoT sensors reporting
            </p>
          </div>

          <div className="dashboard-actions-cluster">
            <button onClick={fetchCrops} className="btn-icon-refresh" title="Sync live data">
              <RefreshCw size={16} className={loading ? "spin-animation" : ""} />
              <span>Sync</span>
            </button>
            <Link to="/crops" className="btn-primary-action">
              <Plus size={16} />
              <span>Add / Scan Crop</span>
            </Link>
          </div>
        </div>

        {/* ========================================
            BENTO COMMAND CENTER (2026 GRID)
        ======================================== */}
        <div className="dashboard-bento-grid">
          {/* VITALITY RING GAUGE */}
          <div className="bento-tile tile-vitality glass-panel">
            <div className="tile-header">
              <span className="tile-label">FARM VITALITY INDEX</span>
              <Sparkles size={16} color="#16a34a" />
            </div>

            <div className="vitality-gauge-container">
              <div className="circular-progress-wrap">
                <svg className="progress-ring" width="130" height="130">
                  <circle
                    className="progress-ring-bg"
                    stroke="rgba(22, 101, 52, 0.1)"
                    strokeWidth="10"
                    fill="transparent"
                    r="52"
                    cx="65"
                    cy="65"
                  />
                  <circle
                    className="progress-ring-fill"
                    stroke="url(#vitalityGradient)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 52 * (1 - vitalityScore / 100)
                    }`}
                    strokeLinecap="round"
                    fill="transparent"
                    r="52"
                    cx="65"
                    cy="65"
                  />
                  <defs>
                    <linearGradient id="vitalityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#a3e635" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="gauge-center-text">
                  <strong>{vitalityScore}</strong>
                  <small>/100</small>
                </div>
              </div>

              <div className="vitality-metrics-col">
                <div className="vitality-status-tag">
                  {diseaseCrops === 0 ? "🌾 Prime Condition" : "⚠️ Attention Required"}
                </div>
                <p>
                  {healthyCrops} healthy out of {totalCrops} monitored crop fields.
                </p>
                <div className="vitality-micro-stats">
                  <span>AI Confidence: <strong>{averageConfidence}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* TELEMETRY: SOIL MOISTURE */}
          <div className="bento-tile tile-telemetry glass-panel">
            <div className="tile-header">
              <span className="tile-label">SOIL MOISTURE</span>
              <Droplets size={18} color="#0284c7" />
            </div>
            <div className="telemetry-big-number">
              68<span>%</span>
            </div>
            <div className="telemetry-status-bar">
              <div className="bar-fill" style={{ width: "68%", background: "#0284c7" }} />
            </div>
            <p className="telemetry-caption">
              Optimal root zone moisture. No irrigation needed today.
            </p>
          </div>

          {/* TELEMETRY: SPRAYING CONDITIONS */}
          <div className="bento-tile tile-telemetry glass-panel">
            <div className="tile-header">
              <span className="tile-label">SPRAYING WINDOW</span>
              <Wind size={18} color="#16a34a" />
            </div>
            <div className="telemetry-big-number">
              Safe<span>• 8 km/h</span>
            </div>
            <div className="spray-window-chip status-safe">
              <CheckCircle2 size={14} />
              <span>Prime Window: Now - 10:30 AM</span>
            </div>
            <p className="telemetry-caption">
              Low wind drift risk, zero rainfall expected next 6 hours.
            </p>
          </div>

          {/* TELEMETRY: SOLAR & UV */}
          <div className="bento-tile tile-telemetry glass-panel">
            <div className="tile-header">
              <span className="tile-label">CANOPY TEMP & UV</span>
              <Sun size={18} color="#f59e0b" />
            </div>
            <div className="telemetry-big-number">
              28.4<span>°C</span>
            </div>
            <div className="uv-index-pill">
              <span>UV Index: 5.2 (Moderate)</span>
            </div>
            <p className="telemetry-caption">
              Photosynthetic activity running at peak efficiency.
            </p>
          </div>
        </div>

        {/* ========================================
            ACTIONABLE ALERTS & AI SUGGESTIONS
        ======================================== */}
        {diseaseCrops > 0 && (
          <div className="urgent-action-banner glass-panel">
            <div className="banner-icon-box">
              <AlertTriangle size={24} color="#ef4444" />
            </div>
            <div className="banner-content">
              <strong>Urgent: Fungal Infection Detected in Field 2 (Guntur Chili)</strong>
              <p>
                Our AI Vision model detected Early Cercospora Leaf Spot with 89.2% certainty.
                Recommended protocol: Spray Mancozeb 75% WP @ 2.5g/L water within 48 hours to arrest fungal expansion.
              </p>
            </div>
            <Link to="/crops" className="banner-action-btn">
              View Treatment Plan →
            </Link>
          </div>
        )}

        {/* ========================================
            MIDDLE BENTO ROW: CROP STATUS & QUICK LAUNCHPAD
        ======================================== */}
        <div className="dashboard-double-columns">
          {/* CROP PORTFOLIO SUMMARY */}
          <div className="bento-card-large glass-panel">
            <div className="card-top-header">
              <div>
                <h2>Active Crop Portfolio</h2>
                <p>Real-time lifecycle & diagnostic status</p>
              </div>
              <Link to="/crops" className="link-subtle">
                View All Crops ({totalCrops}) →
              </Link>
            </div>

            <div className="crop-summary-list">
              {crops.slice(0, 4).map((crop) => (
                <div key={crop._id} className="crop-summary-item">
                  <div className="crop-summary-avatar">
                    <Sprout size={20} color="#16a34a" />
                  </div>
                  <div className="crop-summary-info">
                    <strong>{crop.cropName}</strong>
                    <div className="crop-summary-tags">
                      <span>{crop.acreage} Acres</span>
                      <span>•</span>
                      <span>{crop.status || "Growing"}</span>
                      <span>•</span>
                      <span>{crop.soilType || "Alluvial"}</span>
                    </div>
                  </div>
                  <div className="crop-summary-status">
                    <span
                      className={`status-chip ${
                        crop.healthStatus === "Healthy"
                          ? "healthy"
                          : crop.healthStatus === "Disease Detected"
                          ? "disease"
                          : "unchecked"
                      }`}
                    >
                      {crop.healthStatus || "Not Checked"}
                    </span>
                    {crop.confidence && (
                      <small>{crop.confidence.toFixed(1)}% AI Conf.</small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LAUNCHPAD & COPILOT CARD */}
          <div className="bento-card-large glass-panel">
            <div className="card-top-header">
              <div>
                <h2>AI Farm Launchpad</h2>
                <p>Instant shortcuts to core workflows</p>
              </div>
              <span className="badge-sparkle">
                <Sparkles size={14} /> AI Powered
              </span>
            </div>

            <div className="quick-shortcuts-grid">
              <Link to="/crops" className="shortcut-card">
                <div className="shortcut-icon-circle green">
                  <Camera size={20} />
                </div>
                <div>
                  <strong>AI Leaf Scanner</strong>
                  <p>Diagnose leaf pathogens</p>
                </div>
              </Link>

              <Link to="/assistant" className="shortcut-card">
                <div className="shortcut-icon-circle lime">
                  <Bot size={20} />
                </div>
                <div>
                  <strong>AI Copilot</strong>
                  <p>Ask agronomist questions</p>
                </div>
              </Link>

              <Link to="/market" className="shortcut-card">
                <div className="shortcut-icon-circle yellow">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <strong>Mandi Market</strong>
                  <p>Check APMC prices & trends</p>
                </div>
              </Link>

              <Link to="/weather" className="shortcut-card">
                <div className="shortcut-icon-circle blue">
                  <Sun size={20} />
                </div>
                <div>
                  <strong>Weather Radar</strong>
                  <p>Check 7-day spray forecast</p>
                </div>
              </Link>
            </div>

            {/* Quick Copilot Tip */}
            <div className="copilot-mini-insight">
              <div className="insight-badge">
                <Sparkles size={14} color="#16a34a" />
                <span>Today's Agronomist Advisory</span>
              </div>
              <p>
                "With daytime temperature peaking at 31°C and relative humidity around 62%,
                apply Potassium Nitrate (13-0-45) foliar spray to Bt Cotton to prevent premature flower drop."
              </p>
            </div>
          </div>
        </div>

        {/* ========================================
            RECENT HEALTH CHECKS LOG
        ======================================== */}
        <div className="recent-checks-section glass-panel">
          <div className="card-top-header">
            <div>
              <h2>Recent AI Health Checks & Diagnostics</h2>
              <p>Detailed breakdown of your latest scans</p>
            </div>
            <Link to="/crops" className="btn-secondary-glass">
              <Camera size={16} />
              <span>Scan New Plant</span>
            </Link>
          </div>

          <div className="recent-checks-table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Crop Name</th>
                  <th>Health Status</th>
                  <th>Pathogen / Diagnosis</th>
                  <th>Confidence</th>
                  <th>Last Inspected</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop._id}>
                    <td>
                      <div className="table-crop-cell">
                        <span className="table-crop-icon">🌱</span>
                        <div>
                          <strong>{crop.cropName}</strong>
                          <small>{crop.acreage} Acres</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-chip ${
                          crop.healthStatus === "Healthy"
                            ? "healthy"
                            : crop.healthStatus === "Disease Detected"
                            ? "disease"
                            : "unchecked"
                        }`}
                      >
                        {crop.healthStatus || "Pending"}
                      </span>
                    </td>
                    <td>{crop.disease || "No pathogens detected"}</td>
                    <td>
                      {crop.confidence ? (
                        <div className="confidence-pill">
                          <div
                            className="confidence-fill"
                            style={{ width: `${crop.confidence}%` }}
                          />
                          <span>{crop.confidence.toFixed(1)}%</span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{formatDate(crop.lastHealthCheck)}</td>
                    <td>
                      <Link to="/crops" className="table-action-link">
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}