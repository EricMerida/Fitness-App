import { apiFetch } from "./http";

export function getDashboardApi(token, date) {
  return apiFetch(`/dashboard?date=${encodeURIComponent(date)}`, { token });
}
