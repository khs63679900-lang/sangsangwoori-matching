import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function resetDb() {
  await supabase.from('matches').delete().not('id', 'is', null)
  await supabase.from('seniors').delete().not('id', 'is', null)
  await supabase.from('jobs').delete().not('id', 'is', null)
}

export async function insertJob(data: {
  title: string
  region: string
  job_type: string
  required_career: number
}) {
  const { data: job, error } = await supabase.from('jobs').insert(data).select().single()
  if (error) throw new Error('insertJob 실패: ' + error.message)
  return job
}

export async function countSeniors(): Promise<number> {
  const { count, error } = await supabase
    .from('seniors')
    .select('*', { count: 'exact', head: true })
  if (error) throw new Error('countSeniors 실패: ' + error.message)
  return count ?? 0
}
