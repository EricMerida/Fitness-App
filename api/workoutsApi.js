import { apiFetch } from "./http";

export function listWorkoutsApi(token, { page = 1, limit = 10 } = {}) {
  return apiFetch(`/workouts?page=${page}&limit=${limit}`, { token });
}

export function createWorkoutApi(token, workout) {
  return apiFetch("/workouts", { method: "POST", body: workout, token });
}

export function deleteWorkoutApi(token, id) {
  return apiFetch(`/workouts/${id}`, { method: "DELETE", token });
}
