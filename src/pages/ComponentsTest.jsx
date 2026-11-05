import { Link } from "react-router-dom";

function ComponentsTest() {
  return (
    <div className="common-page">
      <nav className="navbar">
        <div className="logo">🌱 AgriNova</div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/crops">Crops</Link>
          <Link to="/weather">Weather</Link>
          <Link to="/market">Market</Link>
        </div>
      </nav>

      <main className="page-container">
        <div className="page-heading">
          <div>
            <span className="badge">🧩 COMPONENTS</span>
            <h1>AgriNova Components</h1>
            <p>Reusable UI components used across the platform.</p>
          </div>
        </div>

        <section className="component-showcase">
          <div className="showcase-card">
            <h2>Buttons</h2>

            <div className="button-row">
              <button className="btn-primary">Primary Action</button>
              <button className="btn-secondary">Secondary Action</button>
            </div>
          </div>

          <div className="showcase-card">
            <h2>Status</h2>

            <div className="status-row">
              <span className="status-good">✓ Healthy</span>
              <span className="trend-badge">↑ Rising</span>
              <span className="trend-badge falling">↓ Falling</span>
            </div>
          </div>

          <div className="showcase-card">
            <h2>Quick Navigation</h2>

            <div className="button-row">
              <Link to="/dashboard" className="action-card">
                📊 Dashboard →
              </Link>

              <Link to="/crops" className="action-card">
                🌱 Crops →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ComponentsTest;