import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Leaderboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Score 상위</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {["사용자A 82", "사용자B 79", "사용자C 77"].map((v) => (
            <div key={v} className="border border-slate-800 rounded-md p-2">
              {v} (더미)
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>향상률 Top</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {["+12.4% 사용자D", "+9.1% 사용자E", "+7.8% 사용자F"].map((v) => (
            <div key={v} className="border border-slate-800 rounded-md p-2">
              {v} (더미)
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
