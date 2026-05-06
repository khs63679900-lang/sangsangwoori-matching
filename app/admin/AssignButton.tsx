'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { assignMatch } from '@/app/actions'

export function AssignButton({ matchId }: { matchId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      size="sm"
      disabled={pending}
      className="text-base py-2 px-4 bg-green-700 hover:bg-green-800 disabled:opacity-60"
      onClick={() => startTransition(async () => { await assignMatch(matchId) })}
    >
      {pending ? '처리 중…' : '배정 완료'}
    </Button>
  )
}
