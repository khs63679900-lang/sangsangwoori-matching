import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AssignButton } from './AssignButton'

// 시니어별 최고 점수 매칭 1건을 대표로 사용
async function getAdminData() {
  const { data: seniors } = await supabase.from('seniors').select('*').order('created_at', { ascending: false })
  const { data: matches } = await supabase.from('matches').select('*, jobs(title, region)')

  if (!seniors) return { unmatched: [], pending: [], assigned: [] }

  const matchesBySenior = new Map<string, typeof matches>()
  for (const m of matches ?? []) {
    if (!matchesBySenior.has(m.senior_id)) matchesBySenior.set(m.senior_id, [])
    matchesBySenior.get(m.senior_id)!.push(m)
  }

  const unmatched: typeof seniors = []
  const pending:   { senior: (typeof seniors)[0]; topMatch: NonNullable<typeof matches>[0] }[] = []
  const assigned:  { senior: (typeof seniors)[0]; topMatch: NonNullable<typeof matches>[0] }[] = []

  for (const senior of seniors) {
    const ms = matchesBySenior.get(senior.id) ?? []
    if (ms.length === 0) {
      unmatched.push(senior)
      continue
    }
    const sorted = [...ms].sort((a, b) => b.score - a.score)
    const hasAssigned = sorted.some(m => m.status === 'assigned')
    if (hasAssigned) {
      assigned.push({ senior, topMatch: sorted.find(m => m.status === 'assigned')! })
    } else {
      pending.push({ senior, topMatch: sorted[0] })
    }
  }

  return { unmatched, pending, assigned }
}

export default async function AdminPage() {
  const { unmatched, pending, assigned } = await getAdminData()

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-700 mb-2">담당자 대시보드</h1>
      <p className="text-xl text-gray-600 mb-8">시니어 매칭 현황을 한눈에 확인하세요.</p>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">

        {/* 미매칭 */}
        <Column
          label="미매칭"
          count={unmatched.length}
          badgeClass="bg-red-100 text-red-700 border-red-300"
          empty={unmatched.length === 0}
        >
          {unmatched.map(s => (
            <Card key={s.id} className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-lg text-gray-600 flex flex-col gap-1">
                <p>지역: {s.region}</p>
                <p>희망 직종: {s.desired_job}</p>
              </CardContent>
            </Card>
          ))}
        </Column>

        {/* 매칭 대기 */}
        <Column
          label="매칭 대기"
          count={pending.length}
          badgeClass="bg-yellow-100 text-yellow-700 border-yellow-300"
          empty={pending.length === 0}
        >
          {pending.map(({ senior, topMatch }) => {
            const job = topMatch.jobs as { title: string; region: string }
            return (
              <Card key={senior.id} className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{senior.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-lg text-gray-600 flex flex-col gap-2">
                  <p>지역: {senior.region}</p>
                  <p>추천: {job.title} ({topMatch.score}점)</p>
                  <AssignButton matchId={topMatch.id} />
                </CardContent>
              </Card>
            )
          })}
        </Column>

        {/* 배정 완료 */}
        <Column
          label="배정 완료"
          count={assigned.length}
          badgeClass="bg-green-100 text-green-700 border-green-300"
          empty={assigned.length === 0}
        >
          {assigned.map(({ senior, topMatch }) => {
            const job = topMatch.jobs as { title: string; region: string }
            return (
              <Card key={senior.id} className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{senior.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-lg text-gray-600 flex flex-col gap-1">
                  <p>지역: {senior.region}</p>
                  <p>배정: {job.title}</p>
                </CardContent>
              </Card>
            )
          })}
        </Column>

      </div>
    </div>
  )
}

function Column({
  label, count, badgeClass, empty, children,
}: {
  label: string
  count: number
  badgeClass: string
  empty: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-800">{label}</h2>
        <Badge variant="outline" className={`text-lg px-3 py-1 ${badgeClass}`}>
          {count}명
        </Badge>
      </div>
      {empty ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="py-10 text-center text-gray-400 text-xl">없음</CardContent>
        </Card>
      ) : children}
    </div>
  )
}
