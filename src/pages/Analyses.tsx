// src/pages/Analyses.tsx
"use client";

import { useMemo, useState } from "react";
import { useDummyData } from "@/components/DummyDataContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Analyses() {
  const { list } = useDummyData();

  // ===== filters =====
  const [q, setQ] = useState("");
  const [lang, setLang] = useState<string>("__all__");
  const [model, setModel] = useState<string>("__all__");
  const [trigger, setTrigger] = useState<string>("__all__");

  // 옵션은 데이터로부터 유니크 추출
  const { langOptions, modelOptions, triggerOptions } = useMemo(() => {
    const langs = Array.from(new Set(list.map((x) => x.language))).sort();
    const models = Array.from(new Set(list.map((x) => x.model_id))).sort();
    const triggers = Array.from(new Set(list.map((x) => x.trigger))).sort();
    return {
      langOptions: langs,
      modelOptions: models,
      triggerOptions: triggers,
    };
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((x) => {
      if (lang !== "__all__" && x.language !== lang) return false;
      if (model !== "__all__" && x.model_id !== model) return false;
      if (trigger !== "__all__" && x.trigger !== trigger) return false;

      if (q.trim()) {
        const hay = `${x.code} ${x.summary} ${x.categories
          .map((c) => c.name)
          .join(" ")}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [list, lang, model, trigger, q]);

  return (
    <div className="space-y-6">
      {/* ===== 필터 ===== */}
      <div className="grid gap-3 md:grid-cols-4">
        <Input
          placeholder="검색(코드/요약/카테고리)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger>
            <SelectValue placeholder="언어" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">전체 언어</SelectItem>
            {langOptions.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="모델" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">전체 모델</SelectItem>
            {modelOptions.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={trigger} onValueChange={setTrigger}>
          <SelectTrigger>
            <SelectValue placeholder="트리거" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">전체 트리거</SelectItem>
            {triggerOptions.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ===== 리스트 ===== */}
      <Card>
        <CardHeader>
          <CardTitle>
            분석 기록{" "}
            <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
              {filtered.length}건
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm">
          {/* 헤더 */}
          <div className="grid grid-cols-12 gap-3 pb-2 font-semibold text-slate-700 dark:text-slate-200">
            <div className="col-span-2">날짜</div>
            <div className="col-span-2">언어 / 모델</div>
            <div className="col-span-2">점수</div>
            <div className="col-span-2">트리거</div>
            <div className="col-span-2">카테고리</div>
            <div className="col-span-2">요약</div>
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              데이터가 없습니다. 우측 하단 버튼으로 더미를 생성해보세요.
            </div>
          )}

          {filtered.map((it) => (
            <div
              key={it.id}
              className="grid grid-cols-12 gap-3 py-3 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="col-span-2">
                <div className="font-medium">
                  {new Date(it.createdAt).toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  id: {it.id.replace("dummy_", "")}
                </div>
              </div>

              <div className="col-span-2">
                <div className="font-medium">{it.language}</div>
                <div className="text-xs text-slate-500">{it.model_id}</div>
              </div>

              {/* ✅ 점수 리팩토링 */}
              <div className="col-span-2">
                <div className="font-semibold text-violet-600 dark:text-violet-400">
                  {it.scores?.model ?? "-"}점
                </div>
                <div className="text-xs text-slate-500">모델 점수</div>
              </div>

              <div className="col-span-2 capitalize">{it.trigger}</div>

              <div className="col-span-2 space-y-1">
                {it.categories.slice(0, 2).map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="secondary" className="shrink-0">
                      {c.name}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="col-span-2">
                <div className="line-clamp-2 text-slate-700 dark:text-slate-300">
                  {it.summary || (
                    <span className="text-slate-500">요약 없음</span>
                  )}
                </div>
                {/* 코드 미리보기 한 줄 */}
                <pre className="mt-1 text-xs text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap">
                  {String(it.code).split("\n")[0]}
                </pre>
                <div className="mt-2">
                  <Button size="sm" variant="outline" disabled>
                    상세 (준비중)
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length > 0 && (
            <div className="pt-4">
              <Button variant="outline" size="sm" disabled>
                더 보기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
