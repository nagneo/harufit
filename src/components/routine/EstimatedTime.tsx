import { calcEstimatedMinutes } from '@/lib/exercises'

interface EstimatedTimeProps {
  exercises: Array<{ sets: number | null; reps: number | null }>
}

export default function EstimatedTime({ exercises }: EstimatedTimeProps) {
  if (exercises.length === 0) return null
  const minutes = calcEstimatedMinutes(exercises)
  return (
    <p className="text-[13px] text-[var(--muted)]">
      예상 시간: <span className="font-semibold text-[var(--foreground)]">약 {minutes}분</span>
    </p>
  )
}
