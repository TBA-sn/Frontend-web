import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>전역 점수</CardTitle>
          </CardHeader>
          <CardContent>78 (더미)</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>모델 점수</CardTitle>
          </CardHeader>
          <CardContent>74 (더미)</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>최근 PR 분석</CardTitle>
          </CardHeader>
          <CardContent>12건 (더미)</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>향상률</CardTitle>
          </CardHeader>
          <CardContent>+6.2% (더미)</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>점수 추이 그래프</CardTitle>
        </CardHeader>
        <CardContent className="h-48 grid place-items-center text-slate-400">
          라인차트 자리 (더미)
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI 모델별 사용 통계</CardTitle>
          </CardHeader>
          <CardContent className="h-48 grid place-items-center text-slate-400">
            바차트 자리 (더미)
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>오늘의 코드 인사이트</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            함수 길이를 30줄 이하로 유지하면 가독성이 2~3점 향상됩니다. (더미)
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
