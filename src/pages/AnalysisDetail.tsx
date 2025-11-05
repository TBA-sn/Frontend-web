import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AnalysisDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">#{id}</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>전역 vs 모델 점수</CardTitle>
          </CardHeader>
          <CardContent className="h-40 grid place-items-center text-slate-400">
            게이지 자리 (더미)
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>레이더 차트</CardTitle>
          </CardHeader>
          <CardContent className="h-40 grid place-items-center text-slate-400">
            스파이더 차트 자리 (더미)
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>항목별 점수</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3 text-sm">
          {[
            "가독성 82",
            "일관성 76",
            "복잡도 65",
            "테스트성 71",
            "스멜 80",
          ].map((t) => (
            <div key={t} className="rounded-lg border border-slate-800 p-3">
              {t} (더미)
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>개선 제안</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-300">
          <div>• 긴 함수 분리 → 가독성 +2</div>
          <div>• 네이밍 규칙 통일 → 일관성 +3</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>버전별 변화 비교</CardTitle>
        </CardHeader>
        <CardContent className="h-40 grid place-items-center text-slate-400">
          히스토리 차트 자리 (더미)
        </CardContent>
      </Card>
    </div>
  );
}
