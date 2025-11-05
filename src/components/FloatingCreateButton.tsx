// src/components/FloatingCreateButton.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useDummyData } from "./DummyDataContext";
import type { Category } from "./DummyDataContext";

/** ===== 옵션 목록 ===== */
const MODEL_OPTIONS = [
  { value: "starcoder-15b", label: "StarCoder 15B" },
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "codegemma-7b", label: "CodeGemma 7B" },
];

const LANGUAGE_OPTIONS = [
  "javascript",
  "typescript",
  "python",
  "go",
  "java",
  "rust",
].map((v) => ({ value: v, label: v }));

const TRIGGER_OPTIONS = [
  { value: "manual", label: "Manual" },
  { value: "push", label: "Git Push" },
  { value: "pull_request", label: "Pull Request" },
  { value: "pre_commit", label: "Pre-commit" },
];

/** 카테고리(단일 선택) */
const CATEGORY_OPTIONS = [
  { value: "Bug", label: "Bug — 명백한 오류 가능성·예외 누락" },
  { value: "Performance", label: "Performance — 반복/중복·캐싱 누락" },
  {
    value: "Maintainability",
    label: "Maintainability — 복잡도·중첩·함수 길이 등",
  },
  { value: "Style", label: "Style — 네이밍/컨벤션/포맷팅 위반" },
  { value: "Docs", label: "Docs — 주석·Docstring·문서화 비율" },
  { value: "Dependency", label: "Dependency — 버전 최신/불필요 패키지" },
  // 조건부 유지 항목
  {
    value: "Security",
    label: "Security — 단순 취약 패턴(e.g., eval, key 하드코딩)",
  },
  { value: "Testing", label: "Testing — 테스트 파일 존재/커버리지 추정" },
];

export default function FloatingCreateButton() {
  const { addDummy } = useDummyData();
  const [open, setOpen] = useState(false);

  // 폼 상태
  const [modelId, setModelId] = useState("starcoder-15b");
  const [language, setLanguage] = useState("python");
  const [trigger, setTrigger] = useState("manual");
  const [code, setCode] = useState("def add(a, b): return a + b");
  const [summary, setSummary] = useState("전반적으로 간결하고 가독성이 높음.");

  // 🔸 카테고리: 단일 선택 + (단일) 점수/코멘트
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Maintainability");
  const [categoryScore, setCategoryScore] = useState<number>(85);
  const [categoryComment, setCategoryComment] =
    useState<string>("명확한 변수명");

  const clamp01to100 = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  const onSubmit = (ev?: React.FormEvent) => {
    ev?.preventDefault();

    const singleCategory: Category = {
      name: selectedCategory,
      score: clamp01to100(categoryScore),
      comment: categoryComment,
    };

    /** scores:
     * - 입력은 "단일 점수"만 받음 → model에 매핑
     * - global은 타입 유지를 위해 동일 값 저장 (집계 화면에서 전역 평균으로 다시 계산)
     */
    const payload = {
      model_id: modelId,
      code,
      language,
      trigger,
      scores: {
        model: singleCategory.score,
        global: singleCategory.score, // 집계에서 재계산됨
      },
      categories: [singleCategory],
      summary,
    };

    addDummy(payload);
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed right-6 bottom-6 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-16 w-16 rounded-lg shadow-lg bg-violet-600 hover:bg-violet-500 text-white"
              aria-label="더미 데이터 생성"
            >
              <Plus className="size-5" />
            </Button>
          </DialogTrigger>

          {/* 대비 강화: 라이트/다크 모두 또렷 */}
          <DialogContent className="max-w-3xl md:max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <DialogHeader>
              <DialogTitle>더미 분석 데이터 생성</DialogTitle>
              <DialogDescription>
                입력한 값으로 임시 분석 결과를 생성합니다. (메모리 저장)
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-6 mt-2">
              {/* 구역 1: 메타 정보 */}
              <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Model</Label>
                    <Select value={modelId} onValueChange={setModelId}>
                      <SelectTrigger className="mt-1 focus-visible:ring-violet-500">
                        <SelectValue placeholder="모델 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {MODEL_OPTIONS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="mt-1 focus-visible:ring-violet-500">
                        <SelectValue placeholder="언어 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Trigger</Label>
                    <Select value={trigger} onValueChange={setTrigger}>
                      <SelectTrigger className="mt-1 focus-visible:ring-violet-500">
                        <SelectValue placeholder="트리거 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRIGGER_OPTIONS.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              {/* 구역 2: 코드 */}
              <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4">
                <Label>Code</Label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={6}
                  className="mt-1 font-mono focus-visible:ring-violet-500"
                />
              </section>

              {/* 구역 3: 카테고리 & 점수 */}
              <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <Label>Category (1개 선택)</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(v) => {
                        setSelectedCategory(v);
                        if (v === "Performance")
                          setCategoryComment("중복 연산 최적화 필요");
                        if (v === "Bug")
                          setCategoryComment("경계값/예외 처리 보강");
                      }}
                    >
                      <SelectTrigger className="mt-1 focus-visible:ring-violet-500">
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Score (0~100)</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={100}
                      className="mt-1 focus-visible:ring-violet-500"
                      value={categoryScore}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (Number.isNaN(n)) return;
                        // 실시간 클램프
                        const clamped = clamp01to100(n);
                        setCategoryScore(clamped);
                      }}
                      onFocus={(e) => e.currentTarget.select()}
                      onBlur={(e) => {
                        const n = Number(e.currentTarget.value);
                        const clamped = clamp01to100(Number.isNaN(n) ? 0 : n);
                        setCategoryScore(clamped);
                      }}
                    />
                  </div>

                  <div className="md:col-span-5">
                    <Label>Comment</Label>
                    <Input
                      className="mt-1 focus-visible:ring-violet-500"
                      value={categoryComment}
                      onChange={(e) => setCategoryComment(e.target.value)}
                      placeholder="간단한 메모"
                    />
                  </div>
                </div>
              </section>

              {/* 구역 4: 요약 */}
              <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-4">
                <Label>Summary</Label>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="mt-1 focus-visible:ring-violet-500"
                />
              </section>

              <DialogFooter>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">생성 (메모리 저장)</Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
