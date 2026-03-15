'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import Header from '@/components/Header'
import ExerciseConfigRow, { type ExerciseConfig } from '@/components/routine/ExerciseConfigRow'
import ExerciseSearchSheet from '@/components/routine/ExerciseSearchSheet'
import EstimatedTime from '@/components/routine/EstimatedTime'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { ExerciseDefinition } from '@/lib/exercises'

export default function NewRoutinePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [exercises, setExercises] = useState<ExerciseConfig[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  )

  function handleAddExercise(ex: ExerciseDefinition) {
    setExercises((prev) => [
      ...prev,
      {
        dndId: `${ex.id}-${Date.now()}`,
        exerciseId: ex.id,
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        exerciseType: ex.exerciseType ?? 'strength',
        cardioFields: ex.cardioFields,
        sets: ex.defaultSets,
        reps: ex.defaultReps,
        weight: ex.defaultWeight,
        extras: {},
      },
    ])
  }

  function handleUpdate(id: string, updates: Partial<ExerciseConfig>) {
    setExercises((prev) =>
      prev.map((ex) => (ex.dndId === id ? { ...ex, ...updates } : ex))
    )
  }

  function handleRemove(id: string) {
    setExercises((prev) => prev.filter((ex) => ex.dndId !== id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setExercises((prev) => {
        const oldIndex = prev.findIndex((e) => e.dndId === active.id)
        const newIndex = prev.findIndex((e) => e.dndId === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      setError('루틴 이름을 입력해주세요')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('로그인이 필요합니다')

      const { data: routine, error: rErr } = await supabase
        .from('routines')
        .insert({ user_id: user.id, name: name.trim() })
        .select()
        .single()
      if (rErr) throw rErr

      if (exercises.length > 0) {
        const rows = exercises.map((ex, i) => ({
          routine_id: routine.id,
          name: ex.name,
          sets: ex.exerciseType === 'cardio' ? null : ex.sets,
          reps: ex.exerciseType === 'cardio' ? null : ex.reps,
          weight: ex.exerciseType === 'cardio' ? null : ex.weight,
          duration: null,
          extras: ex.exerciseType === 'cardio' && Object.keys(ex.extras).length > 0 ? ex.extras : null,
          sort_order: i,
        }))
        const { error: exErr } = await supabase.from('routine_exercises').insert(rows)
        if (exErr) throw exErr
      }

      router.push(`/routine/${routine.id}`)
    } catch (e) {
      setError((e as Error).message ?? '저장에 실패했어요')
      setSaving(false)
    }
  }

  return (
    <>
      <Header title="새 루틴" backHref="/routine" />
      <div className="px-4 pt-2 pb-8 flex flex-col gap-4">
        {/* Routine name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[var(--muted)] px-1">루틴 이름</label>
          <input
            type="text"
            placeholder="예: 등 루틴 A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-[15px] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
          />
        </div>

        {/* Estimated time */}
        {exercises.length > 0 && (
          <EstimatedTime exercises={exercises} />
        )}

        {/* Exercise list */}
        {exercises.length > 0 && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={exercises.map((e) => e.dndId)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3">
                {exercises.map((ex) => (
                  <ExerciseConfigRow
                    key={ex.dndId}
                    item={ex}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Add exercise button */}
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--muted)] text-[15px] font-medium active:opacity-70 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          운동 추가
        </button>

        {error && (
          <p className="text-[13px] text-red-500 text-center">{error}</p>
        )}

        {/* Save button */}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '저장 중…' : '저장'}
        </Button>
      </div>

      {showSearch && (
        <ExerciseSearchSheet
          onSelect={handleAddExercise}
          onClose={() => setShowSearch(false)}
          selectedIds={exercises.map((e) => e.exerciseId)}
        />
      )}
    </>
  )
}
