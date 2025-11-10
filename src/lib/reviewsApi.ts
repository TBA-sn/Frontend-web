import { authHeader } from "./auth";

const API_BASE = import.meta.env.DEV
  ? "https://<당신의-vercel-도메인>.vercel.app/api" // 예: https://web-dkmv.vercel.app/api
  : "/api";

const LIST_PATH = "/v1/reviews";
const CREATE_PATH = "/v1/reviews/request";

export async function fetchReviews(limit = 20) {
  const url = new URL(`${API_BASE}${LIST_PATH}`);
  url.searchParams.set("limit", String(limit));
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { ...authHeader() },
    credentials: "include",
  });
  if (!res.ok)
    throw new Error(`GET ${LIST_PATH} -> ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function createReviewRaw(payload: unknown) {
  const res = await fetch(`${API_BASE}${CREATE_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok)
    throw new Error(
      `POST ${CREATE_PATH} -> ${res.status}: ${await res.text()}`
    );
  return res.json();
}
