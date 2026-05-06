import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fields = [
  { id: "name", label: "이름", type: "text", placeholder: "홍길동" },
  { id: "region", label: "지역", type: "text", placeholder: "서울, 부산, 대구 등" },
  { id: "desired_job", label: "희망 직종", type: "text", placeholder: "경비, 청소, 사무보조 등" },
  { id: "career_years", label: "경력 (년)", type: "number", placeholder: "예: 10" },
];

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-blue-700 mb-2">프로필 등록</h1>
      <p className="text-xl text-gray-600 mb-8">정보를 입력하시면 맞는 일자리를 찾아드립니다.</p>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl">시니어 정보 입력</CardTitle>
          <CardDescription className="text-lg text-gray-500">
            * 모든 항목을 빠짐없이 입력해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 기능 구현은 다음 블록 — 현재는 레이아웃 뼈대만 */}
          <form className="flex flex-col gap-6">
            {fields.map(({ id, label, type, placeholder }) => (
              <div key={id} className="flex flex-col gap-2">
                <label htmlFor={id} className="text-xl font-semibold text-gray-800">
                  {label}
                </label>
                <Input
                  id={id}
                  name={id}
                  type={type}
                  placeholder={placeholder}
                  className="text-xl h-14 px-4 border-2 border-gray-300 focus:border-blue-600"
                  disabled
                />
              </div>
            ))}

            <Button
              type="submit"
              size="lg"
              disabled
              className="mt-4 w-full text-2xl py-7 bg-blue-700 hover:bg-blue-800 disabled:opacity-50"
            >
              등록하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
