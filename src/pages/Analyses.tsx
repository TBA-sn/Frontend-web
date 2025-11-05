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

export default function Analyses() {
  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div className="grid gap-3 md:grid-cols-4">
        <Input placeholder="기간: 2025-10 ~ 2025-11 (더미)" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="언어" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ts">TypeScript</SelectItem>
            <SelectItem value="js">JavaScript</SelectItem>
            <SelectItem value="py">Python</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="모델" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starcoder">StarCoder</SelectItem>
            <SelectItem value="gpt">GPT</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="트리거" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">수동</SelectItem>
            <SelectItem value="pr">PR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 더미 */}
      <Card>
        <CardHeader>
          <CardTitle>분석 기록</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300">
          <div className="grid grid-cols-6 gap-2 pb-2 font-semibold text-slate-200">
            <div>날짜</div>
            <div>파일</div>
            <div>언어</div>
            <div>모델</div>
            <div>점수</div>
            <div>트리거</div>
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-2 py-2 border-t border-slate-800"
            >
              <div>2025-11-0{i + 1}</div>
              <div className="truncate">src/services/user/createUser.ts</div>
              <div>TS</div>
              <div>StarCoder</div>
              <div>G78 / M74</div>
              <div>PR</div>
            </div>
          ))}
          <div className="pt-4">
            <Button variant="outline" size="sm">
              더 보기 (더미)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
