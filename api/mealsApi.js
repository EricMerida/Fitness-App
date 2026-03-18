import { apiFetch } from "./http";

export function listMealsApi(token, date) {
  return apiFetch(`/meals?date=${encodeURIComponent(date)}`, { token });
}

export function createMealApi(token, payload) {
  return apiFetch("/meals", { method: "POST", body: payload, token });
}

export function deleteMealApi(token, id) {
  return apiFetch(`/meals/${id}`, { method: "DELETE", token });
}
