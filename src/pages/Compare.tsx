import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Compare() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="모델 A 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starcoder">StarCoder</SelectItem>
            <SelectItem value="gpt">GPT</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="모델 B 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt">GPT</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
            <SelectItem value="starcoder">StarCoder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>항목별 차이 (스파이더)</CardTitle>
        </CardHeader>
        <CardContent className="h-56 grid place-items-center text-slate-400">
          스파이더 차트 자리 (더미)
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>모델 특성 요약</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300">
          StarCoder는 일관성↑, GPT는 가독성↑ 경향 (더미)
        </CardContent>
      </Card>
    </div>
  );
}
