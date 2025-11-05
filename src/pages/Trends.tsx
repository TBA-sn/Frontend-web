import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Trends() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>주간 / 월간 평균 점수</CardTitle>
        </CardHeader>
        <CardContent className="h-48 grid place-items-center text-slate-400">
          라인차트 자리 (더미)
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>항목별 상승률</CardTitle>
          </CardHeader>
          <CardContent className="h-40 grid place-items-center text-slate-400">
            바차트 자리 (더미)
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>PR/Push 이벤트 비율</CardTitle>
          </CardHeader>
          <CardContent className="h-40 grid place-items-center text-slate-400">
            도넛 자리 (더미)
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>나의 성과 리포트</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300">
          최근 1개월 요약 (더미)
        </CardContent>
      </Card>
    </div>
  );
}
