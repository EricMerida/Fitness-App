import { apiFetch } from "./http";

export function loginApi(credentials) {
  return apiFetch("/auth/login", { method: "POST", body: credentials });
}

export function registerApi(payload) {
  return apiFetch("/auth/register", { method: "POST", body: payload });
}
