// src/pages/Playground.tsx
import { useMemo, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

type ReviewItem = {
  criterion: string;
  score: number;
  feedback: string;
  line_numbers?: number[];
};
type ReviewResponse = {
  overall_score: number;
  summary: string;
  reviews: ReviewItem[];
};

const SAMPLES: Record<string, string> = {
  ex1: `// 서비스 레이어 예제 (TS)
export async function getUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
`,
  ex2: `// 리액트 훅 예제
import { useEffect, useState } from 'react';
export function useWindowSize() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const onR = () => setW(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  return w;
}
`,
  ex3: `# 파이썬 스크립트
def calculate_average(nums):
    if not nums:
        return 0
    return sum(nums) / len(nums)
`,
};

export default function Playground() {
  const [selected, setSelected] = useState<string>();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReviewResponse | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 샘플 선택 시 코드 채우기
  const onPick = (val: string) => {
    setSelected(val);
    setCode(SAMPLES[val] ?? "");
  };

  const canRun = code.trim().length > 0 && !loading;

  const run = async () => {
    setError(null);
    setData(null);
    setLoading(true);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const resp = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code_to_review: code }),
        signal: ac.signal,
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`HTTP ${resp.status} ${text}`);
      }
      const json = (await resp.json()) as ReviewResponse;
      // 응답 방어코드: reviews가 배열이 아닐 수도 있으니 보정
      const normalized: ReviewResponse = {
        overall_score: Number(json.overall_score ?? 0),
        summary: String(json.summary ?? ""),
        reviews: Array.isArray(json.reviews) ? json.reviews : [],
      };
      setData(normalized);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  };

  const overallPct = useMemo(
    () => Math.max(0, Math.min(100, data?.overall_score ?? 0)),
    [data]
  );

  return (
    <div className="space-y-6">
      {/* 입력 카드 */}
      <Card>
        <CardHeader>
          <CardTitle>샘플 코드 선택 & 분석 실행</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={onPick} value={selected}>
            <SelectTrigger>
              <SelectValue placeholder="코드 블록 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ex1">서비스 레이어 예제</SelectItem>
              <SelectItem value="ex2">리액트 훅 예제</SelectItem>
              <SelectItem value="ex3">파이썬 스크립트</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            className="min-h-[220px] font-mono text-sm"
            placeholder="여기에 코드를 붙여넣거나 샘플을 선택하세요."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Button disabled={!canRun} onClick={run}>
              {loading ? "분석 중..." : "분석 실행"}
            </Button>
            <Button variant="secondary" disabled={!loading} onClick={stop}>
              중단
            </Button>
          </div>

          {error && <div className="text-sm text-red-400">에러: {error}</div>}
        </CardContent>
      </Card>

      {/* 결과 카드 */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-base">
                Overall {overallPct}점
              </Badge>
              <div className="flex-1">
                <Progress value={overallPct} />
              </div>
            </div>

            <p className="text-sm text-slate-300">{data.summary}</p>

            <Separator />

            <ul className="space-y-3">
              {data.reviews.map((r, idx) => (
                <li key={idx} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.criterion}</div>
                    <Badge>{r.score}점</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{r.feedback}</p>
                  {r.line_numbers?.length ? (
                    <div className="mt-2 text-xs text-slate-400">
                      lines: {r.line_numbers.join(", ")}
                    </div>
                  ) : null}
                </li>
              ))}
              {!data.reviews.length && (
                <li className="text-sm text-slate-400">
                  리뷰 항목이 없습니다.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
