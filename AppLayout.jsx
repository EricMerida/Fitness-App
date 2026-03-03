import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import "../../styles/app.css";

export default function AppLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout?.();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbarInner">
          <div className="brand">
            <span className="brandMark" aria-hidden="true">⚡</span>
            <div>
              <div className="brandName">PulseFit</div>
              <div className="brandTag">Train • Track • Improve</div>
            </div>
          </div>

          <nav className="nav navDesktop">
            <NavLink to="/dashboard" end className={({ isActive }) => `navBtn ${isActive ? "isActive" : ""}`}>
              Dashboard
            </NavLink>
            <NavLink to="/workouts" className={({ isActive }) => `navBtn ${isActive ? "isActive" : ""}`}>
              Workouts
            </NavLink>
            <NavLink to="/nutrition" className={({ isActive }) => `navBtn ${isActive ? "isActive" : ""}`}>
              Nutrition
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `navBtn ${isActive ? "isActive" : ""}`}>
              Profile
            </NavLink>
          </nav>

          <div className="topbarActions">
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="container navMobileWrap">
          <nav className="nav navMobile">
            <NavLink to="/dashboard" end className={({ isActive }) => `navBtn ${isActive ? "isActive" : ""}`}>
              Dashboard
            </NavLink>
            <NavLink to="/workouts" className={({ isActive }) => `navBtn ${isActive ? "isActive" : ""}`}>
              Workouts
            </NavLink>
            <NavLink to="/nutrition" className={({ isActive }) => `navBtn ${isActive ? "isActive" : ""}`}>
              Nutrition
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `navBtn ${isActive ? "isActive" : ""}`}>
              Profile
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container page">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="muted">© {new Date().getFullYear()} PulseFit</div>
        <div className="muted">Built for consistency.</div>
      </footer>
    </div>
  );
}

