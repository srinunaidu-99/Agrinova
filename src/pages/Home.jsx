import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  TrendingUp,
  CloudSun,
  Bot,
  Camera,
  CheckCircle2,
  Droplets,
  Layers,
  ChevronRight,
  Calculator,
  Flame,
  Globe2,
  Cpu
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Home() {
  // Interactive ROI Calculator State
  const [acres, setAcres] = useState(10);
  const [cropType, setCropType] = useState("cotton");

  const cropMultiplier = {
    cotton: { name: "Cotton", baseYield: 18, profitPerAcre: 35000 },
    paddy: { name: "Paddy / Rice", baseYield: 24, profitPerAcre: 28000 },
    chili: { name: "Guntur Chili", baseYield: 32, profitPerAcre: 65000 },
    vegetables: { name: "Exotic Vegetables", baseYield: 28, profitPerAcre: 52000 }
  };

  const selectedCrop = cropMultiplier[cropType];
  const estimatedYieldGain = Math.round(acres * selectedCrop.baseYield * 0.22); // +22% avg boost
  const estimatedExtraProfit = Math.round(acres * selectedCrop.profitPerAcre * 0.28); // 28% extra savings & price capture

  const tickerItems = [
    { name: "Wheat (Sharbati)", price: "₹2,840/Qtl", change: "+3.2%", up: true },
    { name: "Paddy (Basmati)", price: "₹3,920/Qtl", change: "+1.8%", up: true },
    { name: "Guntur Chili (Teja)", price: "₹18,600/Qtl", change: "+5.4%", up: true },
    { name: "Cotton (Medium Staple)", price: "₹7,380/Qtl", change: "-0.6%", up: false },
    { name: "Tomato (Hybrid)", price: "₹2,100/Qtl", change: "+8.1%", up: true },
    { name: "Onion (Nashik Red)", price: "₹1,850/Qtl", change: "-2.4%", up: false },
    { name: "Soybean (Yellow)", price: "₹4,650/Qtl", change: "+1.2%", up: true },
    { name: "Turmeric (Salem)", price: "₹13,200/Qtl", change: "+4.5%", up: true }
  ];

  return (
    <div className="home-page-root">
      <Navbar />

      {/* ========================================
          LIVE COMMODITY TICKER MARQUEE
      ======================================== */}
      <div className="ticker-banner-container">
        <div className="ticker-pulse-tag">
          <span className="pulse-dot" />
          <span>LIVE MANDI FEED</span>
        </div>
        <div className="ticker-overflow-mask">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} className="ticker-chip">
                <span className="ticker-name">{item.name}</span>
                <span className="ticker-price">{item.price}</span>
                <span className={`ticker-change ${item.up ? "bullish" : "bearish"}`}>
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================
          HERO SECTION (2026 GEN-Z / AI STYLE)
      ======================================== */}
      <section className="hero-modern-section">
        <div className="hero-backdrop-glow" />
        <div className="hero-content-cluster">
          {/* Top Badge */}
          <div className="hero-pill-badge">
            <Sparkles size={14} className="sparkle-anim" />
            <span>AgriNova 2.0 • Autonomous Agriculture Intelligence</span>
            <ChevronRight size={14} />
          </div>

          {/* Main Headline */}
          <h1 className="hero-main-title">
            Farming at the Speed of <br />
            <span className="gradient-text-green">AI & Satellite Telemetry.</span>
          </h1>

          <p className="hero-subtitle">
            Next-gen farm intelligence for modern growers and agri-preneurs.
            Instant computer-vision crop diagnostics, hyper-local micro-weather
            advisories, and algorithmic mandi arbitrage in one high-performance OS.
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions-row">
            <Link to="/dashboard" className="btn-primary-glow">
              <span>Launch Farm OS</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/assistant" className="btn-secondary-glass">
              <Bot size={18} />
              <span>Talk to AI Copilot</span>
            </Link>

            <Link to="/login" className="btn-tertiary-link">
              <span>Try Live Demo</span>
              <span className="demo-dot">⚡</span>
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="hero-metrics-grid">
            <div className="metric-card">
              <h3>98.4%</h3>
              <p>AI Disease Accuracy</p>
            </div>
            <div className="metric-divider" />
            <div className="metric-card">
              <h3>24/7</h3>
              <p>Telemetry & Monitoring</p>
            </div>
            <div className="metric-divider" />
            <div className="metric-card">
              <h3>+28%</h3>
              <p>Avg. Profit Uplift</p>
            </div>
            <div className="metric-divider" />
            <div className="metric-card">
              <h3>12,400+</h3>
              <p>Acres Managed</p>
            </div>
          </div>
        </div>

        {/* ========================================
            HERO BENTO VISUAL PREVIEW
        ======================================== */}
        <div className="hero-bento-visual">
          <div className="hero-telemetry-card glass-panel">
            <div className="bento-card-header">
              <div className="field-tag">
                <span className="pulse-dot" />
                <span>Field 01 • Cotton (Bt-II)</span>
              </div>
              <span className="status-pill status-healthy">Healthy Growth</span>
            </div>

            <div className="bento-telemetry-row">
              <div className="telemetry-mini-stat">
                <Droplets size={16} color="#0284c7" />
                <div>
                  <small>Soil Moisture</small>
                  <strong>68% (Optimal)</strong>
                </div>
              </div>
              <div className="telemetry-mini-stat">
                <Activity size={16} color="#16a34a" />
                <div>
                  <small>Canopy Index</small>
                  <strong>0.84 NDVI</strong>
                </div>
              </div>
            </div>

            {/* AI Diagnosis Scan Sample */}
            <div className="bento-ai-scanner-box">
              <div className="ai-scanner-header">
                <Camera size={14} color="#16a34a" />
                <span>Live AI Vision Diagnosis</span>
                <span className="ai-confidence-tag">99.1% Confidence</span>
              </div>
              <div className="ai-scanner-body">
                <div className="ai-scan-result-icon">🌿</div>
                <div>
                  <strong>Leaf Health: Optimal</strong>
                  <p>Zero Cercospora leaf spot detected. Next spraying not required for 12 days.</p>
                </div>
              </div>
            </div>

            {/* Live Ticker Mini */}
            <div className="bento-price-card">
              <div className="price-header">
                <span>Guntur APMC Mandi</span>
                <span className="badge-up">+5.4% today</span>
              </div>
              <div className="price-display">
                <strong>₹18,600</strong>
                <small>/ Quintal</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CORE CAPABILITIES (BENTO GRID 2026)
      ======================================== */}
      <section className="features-bento-section">
        <div className="section-header-center">
          <span className="badge-category">INTELLIGENCE SUITE</span>
          <h2>Engineered for the Modern Agronomist</h2>
          <p>
            Experience a frictionless suite of tools powered by deep learning,
            real-time Open-Meteo microclimate models, and Indian mandi data feeds.
          </p>
        </div>

        <div className="bento-features-grid">
          {/* Feature 1 */}
          <div className="bento-feature-item card-ai-vision glass-panel">
            <div className="feature-icon-box">
              <Camera size={26} color="#16a34a" />
            </div>
            <h3>Computer Vision Leaf Diagnostics</h3>
            <p>
              Snap or upload leaf images. Our neural network pinpoints pathogens,
              fungal blights, and deficiency spots in milliseconds with organic
              and chemical treatment schedules.
            </p>
            <div className="feature-badge-row">
              <span className="pill-tag">Instant Analysis</span>
              <span className="pill-tag">Organic & Chemical Cures</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bento-feature-item card-weather glass-panel">
            <div className="feature-icon-box">
              <CloudSun size={26} color="#0284c7" />
            </div>
            <h3>Micro-Climate Spray Window Advisor</h3>
            <p>
              Never waste expensive chemical sprays. Smart atmospheric algorithms
              calculate wind-drift risk, evapotranspiration rates, and rain
              thresholds to give you the ideal spraying hour.
            </p>
            <div className="feature-badge-row">
              <span className="pill-tag">Wind Drift Guard</span>
              <span className="pill-tag">7-Day Forecast</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bento-feature-item card-market glass-panel">
            <div className="feature-icon-box">
              <TrendingUp size={26} color="#f59e0b" />
            </div>
            <h3>Algorithmic Mandi Arbitrage</h3>
            <p>
              Compare live commodity rates across neighboring APMC mandis.
              Capitalize on daily price spikes with algorithmic volume tracking
              and historical trend charts.
            </p>
            <div className="feature-badge-row">
              <span className="pill-tag">Live Tickers</span>
              <span className="pill-tag">Trend Forecasts</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bento-feature-item card-copilot glass-panel">
            <div className="feature-icon-box">
              <Bot size={26} color="#84cc16" />
            </div>
            <h3>Autonomous AI Farm Copilot</h3>
            <p>
              Have a conversation with an agronomist anytime. Ask about N-P-K
              fertilizer dosage calculations, irrigation intervals, and local
              soil health protocols with text-to-speech support.
            </p>
            <div className="feature-badge-row">
              <span className="pill-tag">Natural Speech</span>
              <span className="pill-tag">24/7 Context Aware</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          INTERACTIVE YIELD & PROFIT CALCULATOR
      ======================================== */}
      <section className="calculator-section glass-panel">
        <div className="calculator-layout">
          <div className="calculator-info">
            <div className="calc-badge">
              <Calculator size={16} />
              <span>INTERACTIVE SIMULATOR</span>
            </div>
            <h2>Calculate Your Yield & Profit Acceleration</h2>
            <p>
              See how precision crop management, optimized pesticide timing, and
              market price arbitrage compound into higher returns for your farm.
            </p>

            <div className="calc-controls">
              <div className="calc-group">
                <label>
                  <span>Farm Land Area</span>
                  <strong>{acres} Acres</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="modern-range-slider"
                />
              </div>

              <div className="calc-group">
                <label>Target Primary Crop</label>
                <div className="crop-selector-pills">
                  {Object.keys(cropMultiplier).map((key) => (
                    <button
                      key={key}
                      onClick={() => setCropType(key)}
                      className={`crop-pill-btn ${cropType === key ? "active" : ""}`}
                    >
                      {cropMultiplier[key].name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Results Box */}
          <div className="calculator-result-card glass-panel-dark">
            <span className="result-kicker">PROJECTED ANNUAL ADVANTAGE</span>
            <div className="result-big-number">
              +₹{(estimatedExtraProfit).toLocaleString("en-IN")}
            </div>
            <p className="result-subtext">
              Estimated additional net margin per year with AgriNova 2.0 AI.
            </p>

            <div className="result-breakdown-list">
              <div className="breakdown-item">
                <div className="item-label">
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span>Harvest Yield Increase</span>
                </div>
                <strong>+{estimatedYieldGain} Quintals</strong>
              </div>

              <div className="breakdown-item">
                <div className="item-label">
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span>Chemical / Fertilizer Savings</span>
                </div>
                <strong>~18% Input Reduction</strong>
              </div>

              <div className="breakdown-item">
                <div className="item-label">
                  <CheckCircle2 size={16} color="#4ade80" />
                  <span>Mandi Price Arbitrage Gain</span>
                </div>
                <strong>+₹180 - ₹340 / Qtl</strong>
              </div>
            </div>

            <Link to="/register" className="btn-calc-cta">
              <span>Start Optimizing My Farm</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          COMMUNITY & CALL TO ACTION
      ======================================== */}
      <section className="cta-banner-section">
        <div className="cta-banner-card glass-panel">
          <div className="cta-banner-content">
            <span className="cta-badge">GET STARTED TODAY</span>
            <h2>Ready to Transform Your Farming Operations?</h2>
            <p>
              Join thousands of modern farmers and agronomists already scaling yields
              and profit margins with AgriNova.
            </p>
            <div className="cta-buttons-cluster">
              <Link to="/register" className="btn-primary-glow">
                Create Free Account
              </Link>
              <Link to="/dashboard" className="btn-secondary-glass">
                Explore Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          MODERN FOOTER
      ======================================== */}
      <footer className="modern-footer">
        <div className="footer-top-row">
          <div className="footer-brand">
            <div className="brand-logo-badge">🌱</div>
            <span className="brand-name">
              Agri<strong>Nova</strong> 2.0
            </span>
            <p>
              Next-generation precision agriculture platform. Empowering sustainable
              yields through AI and satellite intelligence.
            </p>
          </div>

          <div className="footer-links-group">
            <h4>Platform</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/crops">Crop Vision</Link>
            <Link to="/weather">Weather Radar</Link>
            <Link to="/market">Mandi Market</Link>
          </div>

          <div className="footer-links-group">
            <h4>Intelligence</h4>
            <Link to="/assistant">AI Farm Copilot</Link>
            <a href="#features">Computer Vision</a>
            <a href="#calculator">ROI Calculator</a>
          </div>

          <div className="footer-system-status">
            <div className="status-indicator-box">
              <span className="pulse-dot" />
              <div>
                <strong>All Systems Operational</strong>
                <small>Telemetry Latency: 24ms</small>
              </div>
            </div>
            <p className="copyright-text">
              © {new Date().getFullYear()} AgriNova Technologies Inc. Built for Next-Gen Farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}