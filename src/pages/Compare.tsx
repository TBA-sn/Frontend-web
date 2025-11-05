// src/pages/Compare.tsx
"use client";

import { useMemo, useState } from "react";
import { useDummyData } from "@/components/DummyDataContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** ========== 상수: 전체 모델/카테고리 (항상 노출) ========== */
const ALL_MODELS_BASE = [
  "starcoder-15b",
  "gpt-4.1",
  "claude-3.5-sonnet",
  "codegemma-7b",
] as const;

const CATEGORY_ORDER = [
  "Bug",
  "Performance",
  "Maintainability",
  "Style",
  "Docs",
  "Dependency",
  "Security",
  "Testing",
] as const;

/** 모델별 막대/배지 컬러 (Tailwind 클래스로 지정) */
const MODEL_STYLE: Record<
  string,
  {
    bar: string;
    badge:
      | "default"
      | "secondary"
      | "outline"
      | "destructive"
      | "secondary"
      | (string & {});
  }
> = {
  "starcoder-15b": { bar: "bg-violet-500", badge: "secondary" },
  "gpt-4.1": { bar: "bg-cyan-500", badge: "secondary" },
  "claude-3.5-sonnet": { bar: "bg-emerald-500", badge: "secondary" },
  "codegemma-7b": { bar: "bg-amber-500", badge: "secondary" },
};

/** 유틸: 평균(소수1자리) */
function mean(nums: number[]) {
  if (!nums.length) return 0;
  const s = nums.reduce((a, b) => a + b, 0);
  return Math.round((s / nums.length) * 10) / 10;
}

export default function Compare() {
  const { list } = useDummyData();

  /** 데이터에 등장한 모델도 합집합으로 포함(확장성) */
  const observedModels = useMemo(
    () => Array.from(new Set(list.map((x) => x.model_id))),
    [list]
  );
  const ALL_MODELS = useMemo(() => {
    const set = new Set<string>([...ALL_MODELS_BASE, ...observedModels]);
    return Array.from(set);
  }, [observedModels]);

  /** 유형(카테고리) 멀티 토글 */
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const toggleCat = (name: string) =>
    setSelectedCats((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  const resetCats = () => setSelectedCats([]);

  /** 실제로 화면에 표시할 카테고리(선택 없으면 전체) */
  const visibleCats =
    selectedCats.length > 0 ? selectedCats : [...CATEGORY_ORDER];

  /**
   * 집계:
   * - 기본: 각 모델의 엔트리(레코드)별 카테고리 평균을 구해 다시 평균
   * - 선택된 카테고리 있으면 해당 카테고리들만 대상으로 동일 계산
   * - 카테고리별 평균도 계산(테이블에서 사용)
   */
  const perModel = useMemo(() => {
    return ALL_MODELS.map((m) => {
      const rows = list.filter((r) => r.model_id === m);

      // 엔트리별 전체 카테고리 평균
      const entryAvgAll = rows
        .map((r) => {
          const cats = r.categories ?? [];
          if (!cats.length) return null;
          return mean(cats.map((c) => Number(c.score || 0)));
        })
        .filter((v): v is number => v !== null);

      // 선택 카테고리 기반 엔트리 평균
      const entryAvgFiltered = rows
        .map((r) => {
          const cats = (r.categories ?? []).filter((c) =>
            visibleCats.includes(c.name)
          );
          if (!cats.length) return null;
          return mean(cats.map((c) => Number(c.score || 0)));
        })
        .filter((v): v is number => v !== null);

      // 화면 표시용 평균
      const avgAll = mean(entryAvgAll);
      const avg = mean(entryAvgFiltered);

      // 카테고리별 평균(선택된 카테고리만)
      const catMap: Record<string, number[]> = {};
      rows.forEach((r) =>
        (r.categories ?? []).forEach((c) => {
          if (!visibleCats.includes(c.name)) return;
          if (!catMap[c.name]) catMap[c.name] = [];
          catMap[c.name].push(Number(c.score || 0));
        })
      );
      const catAvg: Record<string, number> = {};
      visibleCats.forEach((k) => {
        catAvg[k] = catMap[k]?.length ? mean(catMap[k]) : NaN; // NaN이면 데이터 없음 처리
      });

      return {
        modelId: m,
        count: entryAvgFiltered.length, // 표본(선택된 카테고리 기준)
        avg, // 선택된 카테고리 기준 평균
        avgAll, // 전체 기준 평균(참고용)
        catAvg, // 선택된 카테고리들만
      };
    });
  }, [ALL_MODELS, list, visibleCats]);

  /** 정렬: 평균 높은 순 (데이터 없는 모델은 맨 뒤) */
  const sorted = useMemo(() => {
    return [...perModel].sort((a, b) => {
      const av = isNaN(a.avg) ? -Infinity : a.avg;
      const bv = isNaN(b.avg) ? -Infinity : b.avg;
      return bv - av;
    });
  }, [perModel]);

  /** 막대 너비 기준 */
  const maxAvg = useMemo(() => {
    const vals = sorted.map((x) => (isNaN(x.avg) ? 0 : x.avg));
    return Math.max(100, ...vals);
  }, [sorted]);

  return (
    <div className="space-y-6">
      {/* 카테고리 멀티 토글 */}
      <Card>
        <CardHeader>
          <CardTitle>유형 선택 (복수 선택 가능)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCats.length === 0 ? "default" : "outline"}
              onClick={resetCats}
            >
              전체
            </Button>
            {CATEGORY_ORDER.map((name) => {
              const active = selectedCats.includes(name);
              return (
                <Button
                  key={name}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => toggleCat(name)}
                  className={active ? "bg-violet-600 hover:bg-violet-500" : ""}
                >
                  {name}
                </Button>
              );
            })}
          </div>
          <div className="text-xs text-slate-500">
            {selectedCats.length > 0
              ? `선택된 유형: ${selectedCats.join(", ")}`
              : "유형을 선택하지 않으면 전체 카테고리 기준 평균으로 비교합니다."}
          </div>
        </CardContent>
      </Card>

      {/* 모델별 평균 리더보드 */}
      <Card>
        <CardHeader>
          <CardTitle>
            모델별 평균 점수 비교{" "}
            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
              (표본: 선택된 유형 기준, 데이터 없으면 ‘데이터 없음’)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sorted.length === 0 ? (
            <div className="text-sm text-slate-500">모델 목록이 없습니다.</div>
          ) : (
            <div className="space-y-4">
              {sorted.map((row) => {
                const style = MODEL_STYLE[row.modelId] ?? {
                  bar: "bg-slate-400",
                  badge: "secondary",
                };
                const hasData = !isNaN(row.avg) && row.count > 0;
                const width = hasData
                  ? Math.max(2, Math.round((row.avg / maxAvg) * 100))
                  : 0;

                return (
                  <div key={row.modelId} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={style.badge as any}>
                          {row.modelId}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {hasData ? `표본 ${row.count}개` : "데이터 없음"}
                        </span>
                      </div>
                      <div className="font-semibold">
                        {hasData ? `평균 ${row.avg}` : "-"}
                      </div>
                    </div>
                    <div className="h-2 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      {hasData ? (
                        <div
                          className={`h-2 ${style.bar}`}
                          style={{ width: `${width}%` }}
                          title={`${row.avg}`}
                        />
                      ) : (
                        <div className="h-2 w-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 유형별 평균 테이블 (항상 모든 유형 컬럼을 보여줌) */}
      <Card>
        <CardHeader>
          <CardTitle>
            유형별 모델 평균{" "}
            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
              (표: {visibleCats.join(", ")})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[1.5fr_repeat(auto-fit,minmax(120px,1fr))] gap-2 pb-2 font-semibold text-slate-700 dark:text-slate-200">
              <div>모델</div>
              {visibleCats.map((c) => (
                <div key={c} className="text-center">
                  {c}
                </div>
              ))}
            </div>

            {ALL_MODELS.map((modelId) => {
              const row = perModel.find((r) => r.modelId === modelId);
              const style = MODEL_STYLE[modelId] ?? {
                bar: "bg-slate-400",
                badge: "secondary",
              };
              const count = row?.count ?? 0;

              return (
                <div
                  key={modelId}
                  className="grid grid-cols-[1.5fr_repeat(auto-fit,minmax(120px,1fr))] gap-2 py-2 border-t border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={style.badge as any}>{modelId}</Badge>
                    <span className="text-xs text-slate-500">
                      {count > 0 ? `표본 ${count}개` : "데이터 없음"}
                    </span>
                  </div>
                  {visibleCats.map((c) => {
                    const v = row?.catAvg?.[c];
                    const show = typeof v === "number" && !isNaN(v);
                    return (
                      <div key={c} className="text-center">
                        {show ? v : "-"}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
