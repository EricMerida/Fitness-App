import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getProfileApi, updateProfileApi } from "../api/profileApi";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ProfilePage() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const [msg, setMsg] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileApi(token),
    enabled: !!token,
  });

  const [form, setForm] = useState({
    displayName: "",
    heightCm: "",
    weightLb: "",
    activityLevel: "moderate",
    calorieTarget: 2000,
    proteinTarget: 150,
    carbsTarget: 200,
    fatsTarget: 70,
  });

  useEffect(() => {
    if (!data?.profile) return;
    const p = data.profile;

    setForm({
      displayName: p.displayName || "",
      heightCm: p.heightCm ?? "",
      weightLb: p.weightLb ?? "",
      activityLevel: p.activityLevel || "moderate",
      calorieTarget: p.goals?.calorieTarget ?? 2000,
      proteinTarget: p.goals?.proteinTarget ?? 150,
      carbsTarget: p.goals?.carbsTarget ?? 200,
      fatsTarget: p.goals?.fatsTarget ?? 70,
    });
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateProfileApi(token, {
        displayName: form.displayName,
        heightCm: form.heightCm === "" ? null : Number(form.heightCm),
        weightLb: form.weightLb === "" ? null : Number(form.weightLb),
        activityLevel: form.activityLevel,
        goals: {
          calorieTarget: Number(form.calorieTarget),
          proteinTarget: Number(form.proteinTarget),
          carbsTarget: Number(form.carbsTarget),
          fatsTarget: Number(form.fatsTarget),
        },
      }),
    onSuccess: async () => {
      setMsg("Saved!");
      await qc.invalidateQueries({ queryKey: ["profile"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
      setTimeout(() => setMsg(""), 1200);
    },
  });

  return (
    <div className="pageStack">
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Profile & Goals</h1>
          <p className="pageSubtitle">Update your info and daily targets</p>
        </div>

        <div className="pageHeaderRight">
          <Link to="/" className="chipLink">
            ← Homepage
          </Link>
        </div>
      </div>

      {isLoading && (
        <Card>
          <p className="muted">Loading profile...</p>
        </Card>
      )}

      {isError && (
        <Card>
          <p className="errorText">{error?.message || "Failed to load profile."}</p>
        </Card>
      )}

      {data && (
        <>
          <Card>
            <h2 className="sectionTitle">Basics</h2>

            <div className="formGrid">
              <div className="field">
                <label className="fieldLabel">Display name</label>
                <Input
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="e.g., Eric"
                />
              </div>

              <div className="field">
                <label className="fieldLabel">Activity level</label>
                <select
                  value={form.activityLevel}
                  onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
                  className="select"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>

              <div className="field">
                <label className="fieldLabel">Height (cm)</label>
                <Input
                  type="number"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="fieldLabel">Weight (lb)</label>
                <Input
                  type="number"
                  value={form.weightLb}
                  onChange={(e) => setForm({ ...form, weightLb: e.target.value })}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="sectionTitle">Daily targets</h2>

            <div className="formGrid">
              <div className="field">
                <label className="fieldLabel">Calories</label>
                <Input
                  type="number"
                  value={form.calorieTarget}
                  onChange={(e) => setForm({ ...form, calorieTarget: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="fieldLabel">Protein (g)</label>
                <Input
                  type="number"
                  value={form.proteinTarget}
                  onChange={(e) => setForm({ ...form, proteinTarget: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="fieldLabel">Carbs (g)</label>
                <Input
                  type="number"
                  value={form.carbsTarget}
                  onChange={(e) => setForm({ ...form, carbsTarget: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="fieldLabel">Fats (g)</label>
                <Input
                  type="number"
                  value={form.fatsTarget}
                  onChange={(e) => setForm({ ...form, fatsTarget: e.target.value })}
                />
              </div>
            </div>

            <div className="stack">
              <Button
                className="btnBlock"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
              >
                {saveMutation.isPending ? "Saving..." : "Save profile"}
              </Button>

              {saveMutation.isError && (
                <p className="errorText">{saveMutation.error?.message}</p>
              )}

              {msg && <p className="successText">{msg}</p>}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}