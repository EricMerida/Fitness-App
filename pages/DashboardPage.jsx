import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getDashboardApi } from "../api/dashboardApi";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function ProgressRow({ label, value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="progressRow">
      <div className="progressTop">
        <span className="muted">{label}</span>
        <span className="muted">
          {value}/{total}
        </span>
      </div>
      <div className="bar">
        <div className="barFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const [date, setDate] = useState(todayISO());

  const queryKey = useMemo(() => ["dashboard", date], [date]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => getDashboardApi(token, date),
  });

  return (
    <div className="pageStack">
      {/* Header */}
      <div className="pageHeader">
        <div>
          <h1 className="h1">Dashboard</h1>
          <p className="subtext">Your daily performance overview</p>
        </div>

        <div className="pageHeaderRight">
          <label className="label">
            Date
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

        </div>
      </div>

      {/* Quick Links */}
      <div className="pillRow">
        <Link className="pillLink" to="/workouts">🏋️ Workouts</Link>
        <Link className="pillLink" to="/nutrition">🥗 Nutrition</Link>
        <Link className="pillLink" to="/profile">🎯 Profile</Link>
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="card">
          <div className="muted">Loading dashboard…</div>
        </div>
      )}

      {isError && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.35)" }}>
          <div style={{ color: "rgba(254,202,202,1)" }}>
            {error?.message || "Something went wrong"}
          </div>
        </div>
      )}

      {/* Content */}
      {data && (
        <div className="grid3">
          <div className="card">
            <div className="cardTitle">Streak</div>
            <div className="metricValue" style={{ fontSize: 42, marginTop: 8 }}>
              {data.streak}
            </div>
            <div className="muted">days</div>
            <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
              Counts days with a workout or any food log
            </div>
          </div>

          <div className="card">
            <div className="cardTitle">Nutrition</div>
            <div className="cardHint">{data.meals?.count || 0} logged items</div>

            <div className="divider" />

            <div className="kv">
              <span className="muted">Calories</span>
              <span className="kvValue">{Math.round(data.meals?.totals?.calories || 0)}</span>
            </div>
            <div className="kv">
              <span className="muted">Protein</span>
              <span className="kvValue">{Math.round(data.meals?.totals?.protein || 0)} g</span>
            </div>
            <div className="kv">
              <span className="muted">Carbs</span>
              <span className="kvValue">{Math.round(data.meals?.totals?.carbs || 0)} g</span>
            </div>
            <div className="kv">
              <span className="muted">Fats</span>
              <span className="kvValue">{Math.round(data.meals?.totals?.fats || 0)} g</span>
            </div>

            <div style={{ marginTop: 14 }}>
              <Link className="btn btnSecondary btnBlock" to="/nutrition">
                View nutrition
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="cardTitle">Workouts</div>
            <div className="cardHint">{data.workouts?.count || 0} workout(s)</div>

            <div className="divider" />

            <div className="kv">
              <span className="muted">Total volume</span>
              <span className="kvValue">{Math.round(data.workouts?.totalVolume || 0)}</span>
            </div>

            <div style={{ marginTop: 14 }}>
              <Link className="btn btnSecondary btnBlock" to="/workouts">
                View workouts
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Optional: goals card */}
      <div className="card">
        <div className="cardTitle">Weekly Goals</div>
        <div className="cardHint">Stay consistent</div>
        <div className="progressList">
          <ProgressRow label="Workouts" value={4} total={5} />
          <ProgressRow label="Water" value={6} total={7} />
          <ProgressRow label="Steps" value={5} total={7} />
        </div>
      </div>
    </div>
  );
}