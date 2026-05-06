import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const screens = [
  {
    href: "/register",
    title: "프로필 등록",
    description: "시니어 이름, 지역, 희망 직종, 경력을 입력해 매칭을 시작하세요.",
    cta: "등록하러 가기",
  },
  {
    href: "/recommendations",
    title: "추천 목록",
    description: "내 프로필에 맞는 일자리를 점수 순으로 확인하세요.",
    cta: "추천 보기",
  },
  {
    href: "/admin",
    title: "담당자 대시보드",
    description: "미매칭·매칭 대기·배정 완료 현황을 한눈에 관리하세요.",
    cta: "대시보드 열기",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-12 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-3">상상우리</h1>
        <p className="text-2xl text-gray-700">시니어 ↔ 일자리 자동 매칭 시스템</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 w-full">
        {screens.map(({ href, title, description, cta }) => (
          <Card key={href} className="shadow-md border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-700">{title}</CardTitle>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={href}
                className={cn(buttonVariants({ size: "lg" }), "w-full text-xl py-6 bg-blue-700 hover:bg-blue-800")}
              >
                {cta}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
