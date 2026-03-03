import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const nav = useNavigate();
  const { setToken } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { token } = await loginApi(form);
      setToken(token);
      nav("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authHeader">
          <div className="authMark" aria-hidden="true">⚡</div>
          <h1 className="authTitle">Welcome back</h1>
          <p className="authSubtitle">
            Log in to track workouts, nutrition, and progress.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="authForm">
            <div className="field">
              <label className="fieldLabel">Username</label>
              <Input
                placeholder="yourname"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                autoComplete="username"
              />
            </div>

            <div className="field">
              <label className="fieldLabel">Password</label>
              <Input
                placeholder="••••••••"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
              />
            </div>

            <Button
              className="btnBlock"
              disabled={isSubmitting || !form.username || !form.password}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            {error && (
              <div className="alertError" role="alert">
                {error}
              </div>
            )}
          </form>
        </Card>

        <p className="authFooter">
          No account?{" "}
          <Link to="/register" className="authLink">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}