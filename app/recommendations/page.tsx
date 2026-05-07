import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = { searchParams: Promise<{ senior_id?: string; registered?: string }> }

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-green-600' :
    score >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
  return (
    <span
      data-testid="score-badge"
      className={`${color} text-white text-lg font-bold px-4 py-1 rounded-full`}
    >
      {score}점
    </span>
  )
}

export default async function RecommendationsPage({ searchParams }: Props) {
  const { senior_id, registered } = await searchParams

  if (!senior_id) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-600 mb-6">
          먼저 프로필을 등록해야 추천 목록을 확인할 수 있습니다.
        </p>
        <Link
          href="/register"
          className={cn(buttonVariants({ size: "lg" }), "text-xl py-6 px-8 bg-blue-700 hover:bg-blue-800")}
        >
          프로필 등록하러 가기
        </Link>
      </div>
    )
  }

  const [{ data: senior }, { data: matches }] = await Promise.all([
    supabase.from('seniors').select('*').eq('id', senior_id).single(),
    supabase
      .from('matches')
      .select('*, jobs(*)')
      .eq('senior_id', senior_id)
      .order('score', { ascending: false }),
  ])

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-700 mb-1">추천 일자리</h1>
      {senior && (
        <p className="text-xl text-gray-600 mb-4">
          <span className="font-semibold">{senior.name}</span>님의 매칭 결과입니다
          &nbsp;·&nbsp; 지역: {senior.region}
          &nbsp;·&nbsp; 희망직종: {senior.desired_job}
        </p>
      )}

      {registered === 'true' && (
        <div
          data-testid="success-message"
          className="mb-6 bg-green-50 border border-green-400 rounded-lg p-4 text-green-700 text-lg font-semibold"
        >
          등록이 완료되었습니다
        </div>
      )}

      {(!matches || matches.length === 0) ? (
        <div data-testid="no-match" className="text-center py-20 text-gray-500">
          <p className="text-2xl">현재 매칭되는 일자리가 없습니다.</p>
          <p className="text-xl mt-2">지역·직종 조건이 맞는 공고가 등록되면 자동으로 추천됩니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {matches.map((m) => {
            const job = m.jobs as { title: string; region: string; job_type: string; required_career: number }
            return (
              <Card
                key={m.id}
                data-testid="match-card"
                className="shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-2xl text-gray-900">{job.title}</CardTitle>
                  <ScoreBadge score={m.score} />
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-3 pt-0">
                  <Badge variant="outline" className="text-lg px-3 py-1 border-blue-400 text-blue-700">
                    {job.region}
                  </Badge>
                  <Badge variant="outline" className="text-lg px-3 py-1 border-gray-400 text-gray-600">
                    {job.job_type}
                  </Badge>
                  <span className="text-gray-500 text-base">
                    경력 {job.required_career}년 이상 필요
                  </span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
