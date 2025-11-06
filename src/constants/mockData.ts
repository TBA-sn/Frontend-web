// src/constants/mockData.ts

// ===== 품질 관점 (요청한 7개) =====
export type AspectKey =
  | "maintainability" // 유지보수성
  | "readability" // 가독성
  | "scalability" // 확장성
  | "flexibility" // 유연성
  | "simplicity" // 간결성
  | "reusability" // 재사용성
  | "testability"; // 테스트 용이성

export type AspectScores = Record<AspectKey, number>;
export type AspectTexts = Partial<Record<AspectKey, string>>;

// ===== 모델 목록(예시) =====
export const MODEL_IDS = [
  "GPT-4.1",
  "GPT-4o",
  "Claude 3.5 Sonnet",
  "Gemini 2.0 Flash",
  "Qwen 2.5-Coder",
  "Llama 3.1 70B",
  "DeepSeek-Coder V2",
  "GitHub Copilot",
  "Cursor",
] as const;
export type ModelId = (typeof MODEL_IDS)[number];
export const MODEL_OPTIONS = MODEL_IDS.map((m) => ({ value: m, label: m }));

export type MockAnalysis = {
  id: string;
  title: string;
  model: ModelId;
  detectionConfidence: number;
  aspect_scores: AspectScores;
  average_score: number; // 평균 점수
  summaries: AspectTexts; // 각 관점 요약
  comments: AspectTexts; // 각 관점 코멘트
};

// ===== 유틸 =====
const avg = (o: Record<string, number>) =>
  Math.round(
    Object.values(o).reduce((a, b) => a + b, 0) / Object.values(o).length
  );

// ===== 샘플 데이터(편차 크게, 강/약점 다양) =====
export const MOCK_ANALYSES: MockAnalysis[] = [
  {
    id: "sample-01",
    title: "React 상태 관리 스니펫",
    model: "Qwen 2.5-Coder",
    detectionConfidence: 0.92,
    aspect_scores: {
      maintainability: 82,
      readability: 80,
      scalability: 61,
      flexibility: 74,
      simplicity: 78,
      reusability: 83,
      testability: 56,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      maintainability: "훅/유틸 분리와 네이밍 일관성은 양호.",
      readability: "로직 흐름은 직관적이나 주석/가이드는 보강 여지.",
      scalability: "전역/도메인 상태 분리 전략이 약해 확장 시 리스크.",
    },
    comments: {
      reusability: "공통 파생 상태를 유틸로 추출해 재사용도를 더 끌어올리세요.",
      testability: "핵심 훅 단위테스트 스텁 추가가 필요합니다.",
    },
  },
  {
    id: "sample-02",
    title: "Express API 라우팅",
    model: "Llama 3.1 70B",
    detectionConfidence: 0.88,
    aspect_scores: {
      maintainability: 85,
      readability: 77,
      scalability: 81,
      flexibility: 62,
      simplicity: 80,
      reusability: 54,
      testability: 48,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      maintainability: "라우트/서비스 레이어 분리가 명확.",
      scalability: "엔드포인트 증가에 대비한 모듈 구조 적절.",
    },
    comments: {
      readability: "DTO/에러 코드 표준화로 문서 가독성 향상이 필요.",
      testability: "e2e 실패 케이스를 포함하고 목킹 전략을 정의하세요.",
    },
  },
  {
    id: "sample-03",
    title: "Python 데이터 처리 스크립트",
    model: "GPT-4.1",
    detectionConfidence: 1.0,
    aspect_scores: {
      maintainability: 80,
      readability: 78,
      scalability: 74,
      flexibility: 76,
      simplicity: 88,
      reusability: 85,
      testability: 73,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      simplicity: "절차가 단순하고 함수 경계가 비교적 명확.",
      reusability: "공통 변환 로직이 유틸로 추출됨.",
    },
    comments: {
      scalability: "대용량 대비 배치/스트리밍 구성 고려 권장.",
      testability: "입출력 샘플 기반 회귀 테스트를 자동화하세요.",
    },
  },
  {
    id: "sample-04",
    title: "Next.js 서버 액션 + 캐싱",
    model: "GPT-4o",
    detectionConfidence: 0.95,
    aspect_scores: {
      maintainability: 92,
      readability: 90,
      scalability: 88,
      flexibility: 86,
      simplicity: 75,
      reusability: 91,
      testability: 84,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      maintainability: "폴더 구조/모듈 경계 설계가 모범적.",
      reusability: "서버/클라이언트 유틸의 경계가 명확해 재사용성 우수.",
    },
    comments: {
      simplicity: "구성요소가 많아 학습 곡선이 존재—가이드 문서 정리 권장.",
    },
  },
  {
    id: "sample-05",
    title: "Vanilla JS DOM 유틸 모음",
    model: "GitHub Copilot",
    detectionConfidence: 0.67,
    aspect_scores: {
      maintainability: 58,
      readability: 63,
      scalability: 42,
      flexibility: 69,
      simplicity: 71,
      reusability: 64,
      testability: 39,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      simplicity: "간단한 API로 진입 장벽 낮음.",
      flexibility: "옵션 기반 확장 여지가 있음.",
    },
    comments: {
      scalability: "폴리필/브라우저 호환 전략 부재로 규모 확대에 취약.",
      testability: "테스트 러너/커버리지 설정이 없어 회귀 위험이 큼.",
    },
  },
  {
    id: "sample-06",
    title: "Rust CLI 툴(파일 워커)",
    model: "DeepSeek-Coder V2",
    detectionConfidence: 0.79,
    aspect_scores: {
      maintainability: 46,
      readability: 41,
      scalability: 38,
      flexibility: 52,
      simplicity: 44,
      reusability: 37,
      testability: 33,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      readability: "모듈 간 의존성이 얽혀 가독성이 저하.",
      testability: "통합 테스트 부재, 실패 케이스 시뮬레이션 어려움.",
    },
    comments: {
      maintainability: "기능별 크레이트 분리와 에러 타입 정규화가 필요.",
      reusability: "IO/파싱 로직을 별도 라이브러리로 추출하세요.",
    },
  },
  {
    id: "sample-07",
    title: "Android Kotlin 코루틴 네트워킹",
    model: "Gemini 2.0 Flash",
    detectionConfidence: 0.86,
    aspect_scores: {
      maintainability: 71,
      readability: 68,
      scalability: 72,
      flexibility: 83,
      simplicity: 59,
      reusability: 76,
      testability: 65,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      flexibility: "플로우/채널로 다양한 흐름 제어가 가능.",
      reusability: "레포지토리/UseCase 계층이 적절히 분리됨.",
    },
    comments: {
      simplicity: "연산자 체인이 길어 진입 장벽 존재—헬퍼로 단순화 필요.",
      testability: "Dispatcher/Clock 주입으로 비동기 테스트 안정화 권장.",
    },
  },
  {
    id: "sample-08",
    title: "Monorepo Turborepo 설정",
    model: "Cursor",
    detectionConfidence: 0.9,
    aspect_scores: {
      maintainability: 63,
      readability: 57,
      scalability: 89,
      flexibility: 77,
      simplicity: 49,
      reusability: 72,
      testability: 58,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      scalability: "캐시/파이프라인 정의가 대규모에 적합.",
      flexibility: "패키지 단위로 독립 배포 가능.",
    },
    comments: {
      simplicity: "설정 파일이 장황—공통 preset으로 경량화 필요.",
      readability: "워크스페이스 규칙을 README에 명시하세요.",
    },
  },
];
