import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/app.css";

export default function HomePage() {
  const nav = useNavigate();
  const { isAuthed } = useAuth();

  return (
    <div className="app">
      {/* Header */}
      <header className="topbar">
        <div className="brand">
          <span className="brandMark" aria-hidden="true">⚡</span>
          <div>
            <div className="brandName">IronLog</div>
            <div className="brandTag">Log Every Rep • Fuel Every Gain</div>
          </div>
        </div>

        <nav className="nav">
          <button
            className="navBtn"
            onClick={() => nav(isAuthed ? "/dashboard" : "/login")}
          >
            Dashboard
          </button>
          <button
            className="navBtn"
            onClick={() => nav(isAuthed ? "/workouts" : "/login")}
          >
            Workouts
          </button>
          <button
            className="navBtn"
            onClick={() => nav(isAuthed ? "/nutrition" : "/login")}
          >
            Nutrition
          </button>
          <button
            className="navBtn"
            onClick={() => nav(isAuthed ? "/profile" : "/login")}
          >
            Profile
          </button>
        </nav>

        <div className="topbarActions">
          {!isAuthed ? (
            <>
              <button
                className="btn btnGhost"
                onClick={() => nav("/login")}
              >
                Sign in
              </button>
              <button
                className="btn btnPrimary"
                onClick={() => nav("/register")}
              >
                Start today
              </button>
            </>
          ) : (
            <button
              className="btn btnPrimary"
              onClick={() => nav("/dashboard")}
            >
              Open Dashboard
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container">
        <section className="hero">
          <div className="heroLeft">
            <h1 className="h1">
              Log Every Rep.
              <br />
              <span className="gradText">Fuel Every Gain.</span>
            </h1>

            <p className="subtext">
              IronLog is built for lifters who track their training and their fuel.
              Monitor workout volume, log sets and reps, track macros, and stay
              consistent.
            </p>

            <div className="heroCtas">
              <button
                className="btn btnPrimary"
                onClick={() => nav(isAuthed ? "/workouts" : "/register")}
              >
                Start Logging
              </button>

              <button
                className="btn btnSecondary"
                onClick={() => nav(isAuthed ? "/dashboard" : "/login")}
              >
                View Dashboard
              </button>
            </div>

            <div className="pillRow">
              <span className="pill">🏋️ Workout Volume</span>
              <span className="pill">🥩 Macro Tracking</span>
              <span className="pill">📈 Progress Analytics</span>
              <span className="pill">🔥 Streaks</span>
            </div>
          </div>

          <div className="heroRight">
            <div className="card cardGlow">
              <div className="cardHeader">
                <div>
                  <div className="cardTitle">Today’s Session</div>
                  <div className="cardHint">Push Day • Chest & Triceps</div>
                </div>
                <span className="badge">62 min</span>
              </div>

              <div className="metricGrid">
                <div className="metric">
                  <div className="metricLabel">Total Volume</div>
                  <div className="metricValue">18,450 lbs</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Sets</div>
                  <div className="metricValue">21</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Calories</div>
                  <div className="metricValue">2,780</div>
                </div>
                <div className="metric">
                  <div className="metricLabel">Protein</div>
                  <div className="metricValue">192g</div>
                </div>
              </div>

              <div className="divider" />

              <button
                className="btn btnPrimary btnBlock"
                onClick={() => nav(isAuthed ? "/dashboard" : "/register")}
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid">
          <div className="card">
            <div className="cardTitle">Track Your Training</div>
            <p className="subtext">
              Log exercises, sets, reps, and total volume. See how your strength
              progresses week after week.
            </p>
          </div>

          <div className="card">
            <div className="cardTitle">Track Your Fuel</div>
            <p className="subtext">
              Monitor calories and macros so your nutrition supports your goals.
              Bulk smarter. Cut smarter.
            </p>
          </div>

          <div className="card">
            <div className="cardTitle">Stay Consistent</div>
            <p className="subtext">
              Track streaks, weekly targets, and long-term performance trends.
              Consistency builds strength.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="muted">© {new Date().getFullYear()} IronLog</div>
        <div className="muted">Built for lifters.</div>
      </footer>
    </div>
  );
}