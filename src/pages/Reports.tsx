import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>개인 점수 리포트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            최근 30일 요약 PDF/CSV (더미)
            <div className="pt-2">
              <Button size="sm" disabled>
                PDF 다운로드
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>모델 비교 리포트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            모델별 성능 비교표 (더미)
            <div className="pt-2">
              <Button size="sm" disabled>
                CSV 다운로드
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>주간 요약 리포트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            주간 개선 포인트 (더미)
            <div className="pt-2">
              <Button size="sm" disabled>
                PDF 다운로드
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
