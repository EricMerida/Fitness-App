import { apiFetch } from "./http";

export function searchFoodsApi(token, q) {
  return apiFetch(`/foods/search?q=${encodeURIComponent(q)}&pageSize=10&pageNumber=1`, { token });
}
