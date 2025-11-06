// src/components/ExtensionLikePanel.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AspectKey, MockAnalysis } from "@/constants/mockData";
import {
  Wrench,
  BookOpen,
  Expand,
  Shuffle,
  Minimize2,
  Layers,
  FlaskConical,
  Crown,
  ListOrdered,
  Rows3,
} from "lucide-react";

const ICON_PURPLE = "#C586C0";

/** 🔒 패널이 기대하는 '새 7개 키' 고정 순서 */
const ORDER: AspectKey[] = [
  "maintainability",
  "readability",
  "scalability",
  "flexibility",
  "simplicity",
  "reusability",
  "testability",
];

const ASPECT_META: Record<
  AspectKey,
  { label: string; Icon: React.ComponentType<any> }
> = {
  maintainability: { label: "유지보수성", Icon: Wrench },
  readability: { label: "가독성", Icon: BookOpen },
  scalability: { label: "확장성", Icon: Expand },
  flexibility: { label: "유연성", Icon: Shuffle },
  simplicity: { label: "간결성", Icon: Minimize2 },
  reusability: { label: "재사용성", Icon: Layers },
  testability: { label: "테스트 용이성", Icon: FlaskConical },
};

type Props = { data: MockAnalysis & { elapsedMs?: number } };

// 값이 없을 때 표시용
const safeText = (v: React.ReactNode) =>
  v === undefined || v === null || v === "" ? "없음" : v;

/** ✅ 점수 → 티어 매핑 */
function getTier(score: number) {
  if (score >= 85) return { key: "S", name: "S", color: "#7ee787" };
  if (score >= 70) return { key: "A", name: "A", color: "#a5d6ff" };
  if (score >= 55) return { key: "B", name: "B", color: "#f2cc60" };
  if (score >= 40) return { key: "C", name: "C", color: "#ffa657" };
  return { key: "D", name: "D", color: "#ff7b72" };
}

/** ✅ 커스텀 프로그레스바 (트랙 전체 길이가 보이도록) */
function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div
      className="relative h-2.5 rounded-md border border-[#3a3a3a] bg-[#2b2b2b] overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label="aspect score"
    >
      {/* 트랙 눈금(가로 스트라이프) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 8px, transparent 8px, transparent 16px)",
        }}
      />
      {/* 채워진 구간 */}
      <div className="h-full bg-[#7FB7E6]" style={{ width: `${v}%` }} />
      {/* 100% 엔드캡(트랙 끝 표시) */}
      <div className="absolute right-0 top-0 h-full w-px bg-[#555555]" />
    </div>
  );
}

/** 🔀 뷰 모드 */
type ViewMode = "fixed" | "ranked";

export function ExtensionLikePanel({ data }: Props) {
  const {
    aspect_scores,
    average_score,
    model,
    title,
    summaries,
    comments,
    elapsedMs,
  } = data;

  const [mode, setMode] = React.useState<ViewMode>("fixed");

  const elapsedText =
    typeof elapsedMs === "number"
      ? elapsedMs >= 1000
        ? `${(elapsedMs / 1000).toFixed(1)}s`
        : `${elapsedMs}ms`
      : "—";

  /** 공통 엔트리 생성 */
  const entries = React.useMemo(() => {
    const keys: AspectKey[] = Object.keys(ASPECT_META) as AspectKey[];
    return keys.map((key) => {
      const score = (aspect_scores as any)?.[key] ?? 0;
      return {
        key,
        score,
        label: ASPECT_META[key].label,
        Icon: ASPECT_META[key].Icon,
        summary: (summaries as any)?.[key],
        comment: (comments as any)?.[key],
        tier: getTier(score),
      };
    });
  }, [aspect_scores, summaries, comments]);

  /** 고정/순위 정렬 */
  const ordered = React.useMemo(() => {
    if (mode === "fixed") {
      return ORDER.map((k) => entries.find((e) => e.key === k)!).filter(
        Boolean
      );
    }
    // ranked: 점수 내림차순, 동점이면 ORDER 기반 안정 정렬
    const orderIndex = new Map(ORDER.map((k, i) => [k, i]));
    return [...entries].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (orderIndex.get(a.key) ?? 0) - (orderIndex.get(b.key) ?? 0);
    });
  }, [mode, entries]);

  /** ranked 모드에서는 티어 그룹핑 */
  const tierGroups = React.useMemo(() => {
    if (mode !== "ranked") return null;
    const buckets: Record<string, typeof ordered> = {
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
    };
    for (const e of ordered) buckets[e.tier.key].push(e);
    return buckets;
  }, [mode, ordered]);

  return (
    <Card className="m-4 border-[#2a2a2a] bg-[#1e1e1e] text-[#e6e6e6]">
      <CardHeader className="gap-3">
        <div className="flex items-start gap-3">
          <CardTitle className="text-xl font-extrabold tracking-tight">
            Don’t Kill My Vibe
          </CardTitle>

          {/* 모드 토글 */}
          <div className="ml-auto flex items-center gap-1 rounded-lg border border-[#2a2a2a] bg-[#151515] p-1">
            <button
              type="button"
              onClick={() => setMode("fixed")}
              className={[
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
                mode === "fixed"
                  ? "bg-[#262626] text-white"
                  : "text-[#bdbdbd] hover:text-white",
              ].join(" ")}
              aria-pressed={mode === "fixed"}
            >
              <Rows3 className="size-3.5" />
              고정
            </button>
            <button
              type="button"
              onClick={() => setMode("ranked")}
              className={[
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
                mode === "ranked"
                  ? "bg-[#262626] text-white"
                  : "text-[#bdbdbd] hover:text-white",
              ].join(" ")}
              aria-pressed={mode === "ranked"}
            >
              <ListOrdered className="size-3.5" />
              순위
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className="bg-[#2d2d2d] text-[#e6e6e6] border-[#3a3a3a]"
            variant="secondary"
          >
            평균 점수{" "}
            <span className="ml-1 font-semibold tabular-nums">
              {average_score}
            </span>
          </Badge>

          <Badge variant="outline" className="border-[#3a3a3a] text-[#bdbdbd]">
            사용 모델 <span className="ml-1 font-medium">{model}</span>
          </Badge>

          <Badge variant="outline" className="border-[#3a3a3a] text-[#bdbdbd]">
            소요 시간 <span className="ml-1 font-medium">{elapsedText}</span>
          </Badge>

          <span className="ml-auto truncate text-xs text-[#9aa0a6]">
            {title}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <Separator className="mb-6 bg-[#2a2a2a]" />

        {/* ======= 고정 모드: 기존 그리드 ======= */}
        {mode === "fixed" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {ordered.map(({ key, label, Icon, score, summary, comment }) => (
              <AspectCard
                key={key}
                label={label}
                Icon={Icon}
                score={score}
                summary={summary}
                comment={comment}
              />
            ))}
          </div>
        )}

        {/* ======= 순위 모드: 티어 섹션 + 랭킹 뱃지 ======= */}
        {mode === "ranked" && tierGroups && (
          <div className="space-y-6">
            {(["S", "A", "B", "C", "D"] as const).map((tierKey) => {
              const list = tierGroups[tierKey];
              if (!list?.length) return null;
              const color = getTier(
                tierKey === "S"
                  ? 90
                  : tierKey === "A"
                  ? 75
                  : tierKey === "B"
                  ? 60
                  : tierKey === "C"
                  ? 45
                  : 10
              ).color;

              return (
                <section key={tierKey} className="space-y-3">
                  {/* 티어 헤더 */}
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <h3 className="text-sm font-semibold text-[#ededed]">
                      {tierKey} 티어
                    </h3>
                    <span className="text-xs text-[#9aa0a6]">
                      ({list.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {list.map((item, idx) => {
                      const globalRank =
                        ordered.findIndex((e) => e.key === item.key) + 1;
                      const isTop3 = globalRank <= 3;
                      return (
                        <RankedRow
                          key={item.key}
                          rank={globalRank}
                          isTop3={isTop3}
                          label={item.label}
                          Icon={item.Icon}
                          score={item.score}
                          summary={item.summary}
                          comment={item.comment}
                          accentColor={color}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** 공용 카드(고정 모드에서 사용) */
function AspectCard({
  label,
  Icon,
  score,
  summary,
  comment,
}: {
  label: string;
  Icon: React.ComponentType<any>;
  score: number;
  summary: React.ReactNode;
  comment: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] p-4 transition-colors hover:border-[#3a3a3a]">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="grid size-6 place-items-center rounded-md"
            style={{ backgroundColor: `${ICON_PURPLE}1A` }}
          >
            <Icon className="size-4" style={{ color: ICON_PURPLE }} />
          </span>
          <span className="text-sm">{label}</span>
        </div>
        <span className="text-sm tabular-nums">{score}</span>
      </div>

      <ProgressBar value={score} />

      <div className="mt-2 space-y-1.5">
        <p className="text-xs text-[#d4d4d4]">
          <span className="mr-1 rounded bg-[#2a2a2a] px-1.5 py-0.5 text-[10px] text-[#9aa0a6]">
            요약
          </span>
          {safeText(summary)}
        </p>

        <p className="text-xs text-[#bdbdbd]">
          <span className="mr-1 rounded bg-[#2a2a2a] px-1.5 py-0.5 text-[10px] text-[#9aa0a6]">
            코멘트
          </span>
          {safeText(comment)}
        </p>
      </div>
    </div>
  );
}

/** 순위 모드용 리스트 행 */
function RankedRow({
  rank,
  isTop3,
  label,
  Icon,
  score,
  summary,
  comment,
  accentColor,
}: {
  rank: number;
  isTop3: boolean;
  label: string;
  Icon: React.ComponentType<any>;
  score: number;
  summary: React.ReactNode;
  comment: React.ReactNode;
  accentColor: string;
}) {
  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#161616] p-3">
      <div className="flex items-start gap-3">
        {/* 순위 배지 */}
        <div className="relative grid size-8 place-items-center rounded-lg border border-[#3a3a3a] bg-[#1f1f1f]">
          {isTop3 ? (
            <Crown
              className="size-4"
              style={{ color: accentColor }}
              aria-hidden
            />
          ) : (
            <span className="text-xs font-semibold tabular-nums text-[#dcdcdc]">
              {rank}
            </span>
          )}
          <span className="sr-only">{rank}위</span>
        </div>

        {/* 본문 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="grid size-6 place-items-center rounded-md"
                style={{ backgroundColor: `${ICON_PURPLE}1A` }}
              >
                <Icon className="size-4" style={{ color: ICON_PURPLE }} />
              </span>
              <span className="truncate text-sm">{label}</span>
            </div>

            {/* 점수 & 티커 */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-[#3a3a3a] bg-transparent text-[#dcdcdc]"
              >
                <span className="tabular-nums">{score}</span> / 100
              </Badge>
            </div>
          </div>

          <div className="mt-2">
            <ProgressBar value={score} />
          </div>

          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            <p className="text-xs text-[#d4d4d4]">
              <span className="mr-1 rounded bg-[#1f1f1f] px-1.5 py-0.5 text-[10px] text-[#9aa0a6]">
                요약
              </span>
              {safeText(summary)}
            </p>
            <p className="text-xs text-[#bdbdbd]">
              <span className="mr-1 rounded bg-[#1f1f1f] px-1.5 py-0.5 text-[10px] text-[#9aa0a6]">
                코멘트
              </span>
              {safeText(comment)}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 포인트 바(티어 색으로 가이드) */}
      <div
        className="mt-3 h-0.5 w-full rounded bg-[#2a2a2a]"
        style={{
          boxShadow: `inset 0 0 0 9999px rgba(255,255,255,0)`,
        }}
      >
        <div
          className="h-full"
          style={{ width: "100%", backgroundColor: accentColor, opacity: 0.25 }}
        />
      </div>
    </div>
  );
}
