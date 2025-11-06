// src/components/ExtensionLikePanel.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import type { AspectKey, MockAnalysis } from "@/constants/mockData";

import {
  Wrench,
  BookOpen,
  Expand,
  Shuffle,
  Minimize2,
  Layers,
  FlaskConical,
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

  const elapsedText =
    typeof elapsedMs === "number"
      ? elapsedMs >= 1000
        ? `${(elapsedMs / 1000).toFixed(1)}s`
        : `${elapsedMs}ms`
      : "—";

  return (
    <Card className="m-4 border-[#2a2a2a] bg-[#1e1e1e]">
      <CardHeader className="gap-3">
        <CardTitle className="text-xl font-extrabold tracking-tight">
          Don’t Kill My Vibe
        </CardTitle>

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

        <div className="grid gap-4 sm:grid-cols-2">
          {ORDER.map((key) => {
            const { label, Icon } = ASPECT_META[key];
            const score = (aspect_scores as any)?.[key] ?? 0;
            const summary = (summaries as any)?.[key];
            const comment = (comments as any)?.[key];

            return (
              <div
                key={key}
                className="rounded-xl border border-[#2a2a2a] p-4 hover:border-[#3a3a3a] transition-colors"
              >
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

                <Progress
                  value={score}
                  className="bg-[#242424] [&>div]:bg-[#7FB7E6]"
                />

                {(summary || comment) && (
                  <div className="mt-2 space-y-1.5">
                    {summary && (
                      <p className="text-xs text-[#d4d4d4]">
                        <span className="mr-1 rounded bg-[#2a2a2a] px-1.5 py-0.5 text-[10px] text-[#9aa0a6]">
                          요약
                        </span>
                        {summary}
                      </p>
                    )}
                    {comment && (
                      <p className="text-xs text-[#bdbdbd]">
                        <span className="mr-1 rounded bg-[#2a2a2a] px-1.5 py-0.5 text-[10px] text-[#9aa0a6]">
                          코멘트
                        </span>
                        {comment}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
