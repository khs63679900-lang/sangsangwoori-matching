'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

// ── 규칙 기반 매칭 점수 계산 ──────────────────────────────────────
// 지역 일치   +50점
// 직종 일치   +30점
// 경력 충족   +20점  (합계 최대 100점)
function calcScore(
  senior: { region: string; desired_job: string; career_years: number },
  job:    { region: string; job_type: string;   required_career: number }
): number {
  let score = 0
  if (senior.region      === job.region)    score += 50
  if (senior.desired_job === job.job_type)  score += 30
  if (senior.career_years >= job.required_career) score += 20
  return score
}

// ── 시니어 등록 + 자동 매칭 ──────────────────────────────────────
export async function registerSenior(formData: FormData) {
  const name        = (formData.get('name')        as string).trim()
  const region      = (formData.get('region')      as string).trim()
  const desired_job = (formData.get('desired_job') as string).trim()
  const career_years = parseInt(formData.get('career_years') as string, 10) || 0

  if (!name || !region || !desired_job) throw new Error('필수 항목을 입력해 주세요.')

  // 1. seniors 테이블에 저장
  const { data: senior, error } = await supabase
    .from('seniors')
    .insert({ name, region, desired_job, career_years })
    .select()
    .single()

  if (error || !senior) throw new Error('등록 실패: ' + error?.message)

  // 2. 모든 일자리와 비교해 점수 계산
  const { data: jobs } = await supabase.from('jobs').select('*')
  if (jobs && jobs.length > 0) {
    const rows = jobs
      .map(job => ({ senior_id: senior.id, job_id: job.id, score: calcScore(senior, job) }))
      .filter(r => r.score > 0)

    if (rows.length > 0) {
      await supabase.from('matches').insert(rows)
    }
  }

  redirect(`/recommendations?senior_id=${senior.id}`)
}

// ── 매칭 배정 상태 변경 (pending → assigned) ─────────────────────
export async function assignMatch(matchId: string) {
  await supabase.from('matches').update({ status: 'assigned' }).eq('id', matchId)
}
