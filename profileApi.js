import { apiFetch } from "./http";

export function getProfileApi(token) {
  return apiFetch("/profile", { token });
}

export function updateProfileApi(token, payload) {
  return apiFetch("/profile", { method: "PUT", body: payload, token });
}
