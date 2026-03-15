import { CARDIO_FIELD_META } from '@/lib/exercises'
import type { RoutineExercise } from '@/types/routine'

interface ExerciseItemProps {
  exercise: RoutineExercise
}

export default function ExerciseItem({ exercise }: ExerciseItemProps) {
  const parts: string[] = []

  if (exercise.extras && Object.keys(exercise.extras).length > 0) {
    for (const [key, val] of Object.entries(exercise.extras)) {
      if (!val) continue
      const meta = CARDIO_FIELD_META[key as keyof typeof CARDIO_FIELD_META]
      parts.push(meta ? `${val}${meta.unit}` : val)
    }
  } else {
    if (exercise.sets) parts.push(`${exercise.sets}세트`)
    if (exercise.reps) parts.push(`${exercise.reps}회`)
    if (exercise.weight) parts.push(`${exercise.weight}kg`)
    if (exercise.duration) parts.push(exercise.duration)
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
      <p className="text-[15px] font-medium">{exercise.name}</p>
      {parts.length > 0 && (
        <p className="text-[13px] text-[var(--muted)]">{parts.join(' · ')}</p>
      )}
    </div>
  )
}
