// src/pages/Dashboard.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDummyData } from "@/components/DummyDataContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* =======================
   Custom Tooltip Component
========================= */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="rounded-md bg-slate-800 text-white p-3 text-xs shadow-lg border border-slate-700">
        <div className="font-semibold text-violet-300 mb-1">
          점수: {item.score}점
        </div>
        <div>날짜: {item.date}</div>
        <div>모델: {item.model_id}</div>
        <div>유형: {item.category}</div>
        <div>트리거: {item.trigger}</div>
      </div>
    );
  }
  return null;
}

/* =======================
   Dashboard Page
========================= */
export default function Dashboard() {
  const { list } = useDummyData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  /** 전체 평균 점수 */
  const avgScore = useMemo(() => {
    if (!list.length) return 0;
    const scores = list.map((r) => r.scores.model);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [list]);

  /** 총 리뷰 수 */
  const totalReviews = list.length;

  /** 최근 PR 분석 */
  const prCount = list.filter((r) =>
    r.trigger.toLowerCase().includes("pr")
  ).length;

  /** 향상률 계산: 첫 점수 대비 마지막 점수 */
  const improveRate = useMemo(() => {
    if (list.length < 2) return "-";
    const first = list.at(-1)?.scores.model ?? 0; // 최신이 위에 오니까 뒤집어서
    const last = list[0]?.scores.model ?? 0;
    if (first === 0) return "-";
    const diff = last - first;
    const rate = ((diff / first) * 100).toFixed(1);
    return `${diff >= 0 ? "+" : ""}${rate}%`;
  }, [list]);

  /** 점수 추이 그래프 데이터 */
  const trendData = useMemo(() => {
    if (!list.length) return [];
    // 최신 데이터가 위로 들어가 있으므로 뒤집어서 시간 순서 정렬
    const reversed = [...list].reverse();

    return reversed.map((item, i) => ({
      index: i + 1, // X축: 리뷰 순서
      score: item.scores.model,
      date: new Date(item.createdAt).toLocaleString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      model_id: item.model_id,
      trigger: item.trigger,
      category: item.categories?.[0]?.name ?? "-",
    }));
  }, [list]);

  return (
    <div className="space-y-6">
      {/* 상단 카드 영역 */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* 평균 점수 */}
        <Card>
          <CardHeader>
            <CardTitle>평균 점수</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-semibold text-violet-600 dark:text-violet-400">
                {avgScore || "-"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 총 리뷰 수 */}
        <Card>
          <CardHeader>
            <CardTitle>총 리뷰 수</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-semibold text-slate-700 dark:text-slate-100">
                {totalReviews}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 최근 PR */}
        <Card>
          <CardHeader>
            <CardTitle>최근 PR 분석</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-lg text-slate-500">{prCount} 건</p>
            )}
          </CardContent>
        </Card>

        {/* 향상률 */}
        <Card>
          <CardHeader>
            <CardTitle>향상률</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p
                className={`text-lg font-semibold ${
                  improveRate.startsWith("+")
                    ? "text-emerald-500"
                    : improveRate === "-"
                    ? "text-slate-400"
                    : "text-rose-500"
                }`}
              >
                {improveRate}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 점수 추이 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle>점수 추이</CardTitle>
        </CardHeader>
        <CardContent className="h-64 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-40 w-full" />
            </div>
          ) : trendData.length === 0 ? (
            <div className="h-full grid place-items-center text-slate-400 text-sm">
              데이터 없음
            </div>
          ) : (
            <div className="min-w-[800px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis
                    dataKey="index"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(v) => `#${v}`}
                  />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
