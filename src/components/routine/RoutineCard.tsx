import Card from '@/components/ui/Card'
import { calcEstimatedMinutes } from '@/lib/exercises'
import type { Routine } from '@/types/routine'

interface RoutineCardProps {
  routine: Routine
  onClick: () => void
}

export default function RoutineCard({ routine, onClick }: RoutineCardProps) {
  const exerciseCount = routine.exercises?.length ?? 0
  const estimatedMin = routine.exercises
    ? calcEstimatedMinutes(routine.exercises)
    : 0

  return (
    <Card onClick={onClick} className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold truncate">{routine.name}</p>
          <p className="text-[13px] text-[var(--muted)] mt-0.5">
            {exerciseCount}가지 운동
            {estimatedMin > 0 && ` · 약 ${estimatedMin}분`}
          </p>
        </div>
        {routine.is_active && (
          <span className="shrink-0 text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-1 rounded-full">
            활성
          </span>
        )}
      </div>
    </Card>
  )
}
