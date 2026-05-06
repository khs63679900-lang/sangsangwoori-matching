import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 뼈대용 더미 데이터 — 기능 구현 블록에서 실제 Supabase 데이터로 교체
const placeholderMatches = [
  { id: "1", jobTitle: "아파트 경비원", region: "서울", score: 92 },
  { id: "2", jobTitle: "사무 보조원", region: "부산", score: 78 },
  { id: "3", jobTitle: "청소 관리원", region: "서울", score: 65 },
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-600" : score >= 60 ? "bg-yellow-500" : "bg-gray-400";
  return (
    <span className={`${color} text-white text-lg font-bold px-4 py-1 rounded-full`}>
      {score}점
    </span>
  );
}

export default function RecommendationsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-700 mb-2">추천 일자리</h1>
      <p className="text-xl text-gray-600 mb-8">매칭 점수가 높은 순서로 표시됩니다.</p>

      {/* 기능 구현은 다음 블록 — 현재는 더미 데이터 레이아웃만 */}
      <div className="flex flex-col gap-6">
        {placeholderMatches.map((match) => (
          <Card key={match.id} className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl text-gray-900">{match.jobTitle}</CardTitle>
              <ScoreBadge score={match.score} />
            </CardHeader>
            <CardContent className="flex items-center gap-4 pt-0">
              <Badge variant="outline" className="text-lg px-3 py-1 border-blue-400 text-blue-700">
                {match.region}
              </Badge>
              <span className="text-gray-400 text-base">(더미 데이터 — 기능 구현 전)</span>
            </CardContent>
          </Card>
        ))}

        {placeholderMatches.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-2xl">추천 일자리가 없습니다.</p>
            <p className="text-xl mt-2">먼저 프로필을 등록해 주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
