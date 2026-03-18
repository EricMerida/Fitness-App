import { apiFetch } from "./http";

export function meApi(token) {
  return apiFetch("/me", { token });
}
