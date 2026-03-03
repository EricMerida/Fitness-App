import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import {
  listWorkoutsApi,
  createWorkoutApi,
  deleteWorkoutApi,
} from "../api/workoutsApi";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function WorkoutsPage() {
  const { token } = useAuth();
  const qc = useQueryClient();

  const [date, setDate] = useState(todayISO());
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workouts", date],
    queryFn: () => listWorkoutsApi(token, date),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createWorkoutApi(token, {
        date,
        name: name.trim(),
        notes: notes.trim(),
      }),
    onSuccess: () => {
      setName("");
      setNotes("");
      qc.invalidateQueries({ queryKey: ["workouts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteWorkoutApi(token, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workouts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return (
    <div className="pageStack">
      {/* Header */}
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Workouts</h1>
          <p className="pageSubtitle">Log training sessions and track volume</p>
        </div>

        <div className="pageHeaderRight">
          <div className="dateWrap">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <Link to="/" className="chipLink">
            ← Homepage
          </Link>
        </div>
      </div>

      {/* Create */}
      <Card>
        <h2 className="sectionTitle">Add workout</h2>
        <p className="muted">
          Start simple: name + notes. We’ll add exercises next.
        </p>

        <div className="formGrid">
          <div className="field">
            <label className="fieldLabel">Workout name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Push day, Legs, Run..."
            />
          </div>

          <div className="field">
            <label className="fieldLabel">Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Felt strong, PR, etc."
            />
          </div>
        </div>

        <div className="stack">
          <Button
            className="btnBlock"
            disabled={createMutation.isPending || !name.trim()}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? "Adding..." : "Add workout"}
          </Button>

          {createMutation.isError && (
            <p className="errorText">{createMutation.error.message}</p>
          )}
        </div>
      </Card>

      {/* List */}
      {isLoading && (
        <Card>
          <p className="muted">Loading workouts...</p>
        </Card>
      )}

      {isError && (
        <Card>
          <p className="errorText">{error.message}</p>
        </Card>
      )}

      {data?.items?.length === 0 && (
        <Card>
          <p className="muted">No workouts logged for this date.</p>
        </Card>
      )}

      <div className="stack">
        {data?.items?.map((w) => (
          <Card key={w._id}>
            <div className="rowCard">
              <div>
                <div className="rowTitle">{w.name}</div>
                {w.notes && <div className="muted">{w.notes}</div>}
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  Volume: {Math.round(w.totalVolume || 0)}
                </div>
              </div>

              <Button
                variant="danger"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(w._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
