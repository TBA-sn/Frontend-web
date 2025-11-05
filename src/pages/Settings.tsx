import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function Settings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>환경</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="ide">IDE 모델 자동 감지</Label>
            <Switch id="ide" disabled />
          </div>
          <div>
            <Label>모델 가중치 (더미)</Label>
            <Slider defaultValue={[60]} max={100} step={1} className="mt-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
