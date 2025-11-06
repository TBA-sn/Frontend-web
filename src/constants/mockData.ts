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

// ===== 샘플 데이터(필요만큼 유지) =====
export const MOCK_ANALYSES: MockAnalysis[] = [
  {
    id: "sample-01",
    title: "React 상태 관리 스니펫",
    model: "Qwen 2.5-Coder",
    detectionConfidence: 0.92,
    aspect_scores: {
      maintainability: 82,
      readability: 80,
      scalability: 76,
      flexibility: 79,
      simplicity: 78,
      reusability: 83,
      testability: 72,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      maintainability: "훅/유틸 분리와 네이밍 일관성은 양호.",
      readability: "로직 흐름은 직관적이나 주석/가이드 보강 여지.",
      scalability: "상태 범위가 확장될 때 셀렉터 구조 고려 필요.",
    },
    comments: {
      reusability: "공통 파생 상태는 별도 유틸로 추출해 재사용하세요.",
      testability: "핵심 훅에 대한 단위테스트 스텁을 추가하세요.",
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
      flexibility: 75,
      simplicity: 80,
      reusability: 79,
      testability: 70,
    },
    get average_score() {
      return avg(this.aspect_scores);
    },
    summaries: {
      maintainability: "라우트/서비스 레이어 분리가 명확.",
      scalability: "엔드포인트 증가에 대비한 모듈 구조 적절.",
    },
    comments: {
      readability: "DTO/에러 코드 표준화로 문서 가독성을 높이세요.",
      testability: "e2e 시나리오에 실패 케이스를 포함하세요.",
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
      simplicity: 82,
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
      scalability: "대용량 처리에 대비해 배치/스트리밍 모델 고려.",
      testability: "입력/출력 샘플 기반의 회귀 테스트 추가.",
    },
  },
];
