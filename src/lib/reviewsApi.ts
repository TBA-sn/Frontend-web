// src/lib/reviewsApi.ts
// ===== 필요 시 여기만 바꾸세요 =====
const LIST_PATH = "/v1/reviews"; // 또는 "/reviews"
const CREATE_PATH = "/v1/reviews/request"; // 생성은 계속 쓰실 거면 유지

// 배포: 상대경로(/api) 사용, 로컬 DEV: 배포 도메인 직접 호출(프록시 경유)
const API_BASE = import.meta.env.DEV
  ? "https://<당신의-베르셀-도메인>.vercel.app/api" // 예: https://web-dkmv.vercel.app/api
  : "/api";

// === 조회(인증 불필요 버전) ===
export async function fetchReviews(limit = 50) {
  // <-- base를 명시해야 Invalid URL 안 납니다
  const url = new URL(
    `${API_BASE}${LIST_PATH}`,
    typeof window !== "undefined" ? window.location.origin : "http://localhost"
  );
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), { method: "GET" }); // 인증 필요 없으면 헤더 X
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`GET ${LIST_PATH} -> ${res.status}: ${t}`);
  }
  return res.json();
}

// === 생성(인증 필요할 때만 사용) ===
export async function createReviewRaw(payload: unknown) {
  const res = await fetch(
    new URL(
      `${API_BASE}${CREATE_PATH}`,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost"
    ).toString(),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" /* , ...authHeader() */ },
      body: JSON.stringify(payload),
      // credentials: "include", // 쿠키 인증 쓰면 활성화
    }
  );
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`POST ${CREATE_PATH} -> ${res.status}: ${t}`);
  }
  return res.json();
}
