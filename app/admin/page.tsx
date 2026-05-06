import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 뼈대용 더미 데이터 — 기능 구현 블록에서 실제 Supabase 데이터로 교체
const columns = [
  {
    key: "unmatched",
    label: "미매칭",
    badgeClass: "bg-red-100 text-red-700 border-red-300",
    items: [
      { id: "s1", name: "김철수", region: "서울", desired_job: "경비원" },
      { id: "s2", name: "이영희", region: "부산", desired_job: "사무보조" },
    ],
  },
  {
    key: "pending",
    label: "매칭 대기",
    badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-300",
    items: [
      { id: "s3", name: "박민준", region: "대구", desired_job: "청소관리" },
    ],
  },
  {
    key: "assigned",
    label: "배정 완료",
    badgeClass: "bg-green-100 text-green-700 border-green-300",
    items: [
      { id: "s4", name: "최순자", region: "인천", desired_job: "경비원" },
      { id: "s5", name: "정대한", region: "서울", desired_job: "배달보조" },
    ],
  },
];

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-700 mb-2">담당자 대시보드</h1>
      <p className="text-xl text-gray-600 mb-8">시니어 매칭 현황을 한눈에 확인하세요.</p>

      {/* 기능 구현은 다음 블록 — 현재는 더미 데이터 레이아웃만 */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {columns.map(({ key, label, badgeClass, items }) => (
          <div key={key} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
              <Badge variant="outline" className={`text-lg px-3 py-1 ${badgeClass}`}>
                {items.length}명
              </Badge>
            </div>

            {items.map((item) => (
              <Card key={item.id} className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-gray-900">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col gap-1">
                  <p className="text-lg text-gray-600">
                    <span className="font-medium">지역:</span> {item.region}
                  </p>
                  <p className="text-lg text-gray-600">
                    <span className="font-medium">희망 직종:</span> {item.desired_job}
                  </p>
                </CardContent>
              </Card>
            ))}

            {items.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="py-10 text-center text-gray-400 text-xl">
                  없음
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
