import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Playground() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>샘플 코드 선택 & 분석 실행</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="코드 블록 선택 (더미)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ex1">서비스 레이어 예제</SelectItem>
              <SelectItem value="ex2">리액트 훅 예제</SelectItem>
              <SelectItem value="ex3">파이썬 스크립트</SelectItem>
            </SelectContent>
          </Select>
          <Button>분석 실행 (더미)</Button>
          <div className="text-sm text-slate-300">
            랜덤 점수 결과가 여기 표시됩니다. (더미)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
