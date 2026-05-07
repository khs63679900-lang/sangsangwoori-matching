'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export type ActionState = { error: string } | null

const REGION_MAP: Record<string, string> = {
  '서울특별시': '서울',
  '경기도':    '경기',
  '인천광역시': '인천',
}

const JOB_MAP: Record<string, string> = {
  '경비직': '경비',
  '청소직': '청소',
  '조리직': '조리',
  '돌봄직': '돌봄',
}

const nr = (v: string) => REGION_MAP[v] ?? v
const nj = (v: string) => JOB_MAP[v]    ?? v

function calcScore(
  senior: { region: string; desired_job: string; career_years: number },
  job:    { region: string; job_type: string;   required_career: number }
): number {
  let score = 0
  if (nr(senior.region)      === nr(job.region))   score += 50
  if (nj(senior.desired_job) === nj(job.job_type)) score += 30
  if (senior.career_years >= job.required_career)  score += 20
  return score
}

export async function registerSenior(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name        = (formData.get('name')        as string ?? '').trim()
  const region      = (formData.get('region')      as string ?? '').trim()
  const desired_job = (formData.get('desired_job') as string ?? '').trim()
  const career_years = parseInt(formData.get('career_years') as string, 10) || 0

  if (!name)        return { error: '이름을 입력해 주세요.' }
  if (!region)      return { error: '지역을 입력해 주세요.' }
  if (!desired_job) return { error: '희망 직종을 입력해 주세요.' }

  const { data: senior, error } = await supabase
    .from('seniors')
    .insert({ name, region, desired_job, career_years })
    .select()
    .single()

  if (error || !senior) return { error: '등록 실패: ' + error?.message }

  const { data: jobs } = await supabase.from('jobs').select('*')
  if (jobs && jobs.length > 0) {
    const rows = jobs
      .map(job => ({ senior_id: senior.id, job_id: job.id, score: calcScore(senior, job) }))
      .filter(r => r.score > 0)

    if (rows.length > 0) {
      await supabase.from('matches').insert(rows)
    }
  }

  redirect(`/recommendations?senior_id=${senior.id}&registered=true`)
}

export async function assignMatch(matchId: string) {
  await supabase.from('matches').update({ status: 'assigned' }).eq('id', matchId)
}
