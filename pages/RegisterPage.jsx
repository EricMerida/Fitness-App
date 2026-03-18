import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi, loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function RegisterPage() {
  const nav = useNavigate();
  const { setToken } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) create account
      await registerApi(form);

      // 2) auto-login immediately (nice UX)
      const { token } = await loginApi(form);
      setToken(token);

      nav("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authHeader">
          <div className="authMark" aria-hidden="true">⚡</div>
          <h1 className="authTitle">Create your account</h1>
          <p className="authSubtitle">
            Start tracking workouts, nutrition, and progress.
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
                autoComplete="new-password"
              />
            </div>

            <Button
              className="btnBlock"
              disabled={loading || !form.username || !form.password}
            >
              {loading ? "Creating..." : "Create account"}
            </Button>

            {error && (
              <div className="alertError" role="alert">
                {error}
              </div>
            )}
          </form>
        </Card>

        <p className="authFooter">
          Already have an account?{" "}
          <Link to="/login" className="authLink">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}