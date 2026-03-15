'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CARDIO_FIELD_META, type CardioField } from '@/lib/exercises'

export type ExerciseConfig = {
  dndId: string
  exerciseId: string
  name: string
  muscleGroup: string
  exerciseType: 'strength' | 'cardio'
  cardioFields?: CardioField[]
  sets: number
  reps: number
  weight: number | null
  extras: Record<string, string>
}

interface ExerciseConfigRowProps {
  item: ExerciseConfig
  onUpdate: (id: string, updates: Partial<ExerciseConfig>) => void
  onRemove: (id: string) => void
}

export default function ExerciseConfigRow({ item, onUpdate, onRemove }: ExerciseConfigRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.dndId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isCardio = item.exerciseType === 'cardio'

  return (
    <div ref={setNodeRef} style={style} className="bg-[var(--surface)] rounded-2xl px-4 pt-3 pb-4 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="text-[var(--muted)] touch-none cursor-grab active:cursor-grabbing p-1 -ml-1"
          aria-label="순서 변경"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="5" cy="4" r="1.2" fill="currentColor" />
            <circle cx="11" cy="4" r="1.2" fill="currentColor" />
            <circle cx="5" cy="8" r="1.2" fill="currentColor" />
            <circle cx="11" cy="8" r="1.2" fill="currentColor" />
            <circle cx="5" cy="12" r="1.2" fill="currentColor" />
            <circle cx="11" cy="12" r="1.2" fill="currentColor" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold truncate">{item.name}</p>
          <p className="text-[12px] text-[var(--muted)]">{item.muscleGroup}</p>
        </div>
        <button
          onClick={() => onRemove(item.dndId)}
          className="text-[var(--muted)] active:text-red-500 transition-colors p-1 -mr-1"
          aria-label="운동 삭제"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Inputs */}
      <div className="flex gap-2">
        {isCardio ? (
          // 유산소 전용 필드
          (item.cardioFields ?? ['duration']).map((field) => {
            const meta = CARDIO_FIELD_META[field]
            return (
              <TextField
                key={field}
                label={`${meta.label} (${meta.unit})`}
                value={item.extras[field] ?? ''}
                placeholder={meta.placeholder}
                onChange={(v) =>
                  onUpdate(item.dndId, { extras: { ...item.extras, [field]: v } })
                }
              />
            )
          })
        ) : (
          // 근력 운동 필드
          <>
            <NumberField
              label="무게 (kg)"
              value={item.weight}
              placeholder="맨몸"
              onChange={(v) => onUpdate(item.dndId, { weight: v })}
            />
            <NumberField
              label="세트"
              value={item.sets}
              placeholder="3"
              onChange={(v) => onUpdate(item.dndId, { sets: v ?? 3 })}
            />
            <NumberField
              label="횟수"
              value={item.reps}
              placeholder="10"
              onChange={(v) => onUpdate(item.dndId, { reps: v ?? 10 })}
            />
          </>
        )}
      </div>
    </div>
  )
}

function NumberField({
  label, value, placeholder, onChange,
}: {
  label: string; value: number | null; placeholder: string; onChange: (v: number | null) => void
}) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label className="text-[11px] font-medium text-[var(--muted)] text-center">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-full py-2.5 rounded-xl text-[15px] text-center bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
      />
    </div>
  )
}

function TextField({
  label, value, placeholder, onChange,
}: {
  label: string; value: string; placeholder: string; onChange: (v: string) => void
}) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label className="text-[11px] font-medium text-[var(--muted)] text-center">{label}</label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full py-2.5 rounded-xl text-[15px] text-center bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
      />
    </div>
  )
}
