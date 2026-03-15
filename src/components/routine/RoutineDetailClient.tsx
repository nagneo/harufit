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
import ExerciseItem from './ExerciseItem'
import ExerciseConfigRow, { type ExerciseConfig } from './ExerciseConfigRow'
import ExerciseSearchSheet from './ExerciseSearchSheet'
import EstimatedTime from './EstimatedTime'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { calcEstimatedMinutes, getExerciseById } from '@/lib/exercises'
import type { Routine } from '@/types/routine'
import type { ExerciseDefinition } from '@/lib/exercises'

interface RoutineDetailClientProps {
  routine: Routine
}

export default function RoutineDetailClient({ routine: initialRoutine }: RoutineDetailClientProps) {
  const router = useRouter()
  const [routine, setRoutine] = useState(initialRoutine)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(routine.name)
  const [exercises, setExercises] = useState<ExerciseConfig[]>(
    (routine.exercises ?? []).map((ex) => {
      const libEx = getExerciseById(ex.id) // library lookup by name fallback below
      const isCardio = ex.extras !== null && ex.extras !== undefined
      return {
        dndId: ex.id,
        exerciseId: ex.id,
        name: ex.name,
        muscleGroup: libEx?.muscleGroup ?? '',
        exerciseType: isCardio ? 'cardio' : 'strength',
        cardioFields: libEx?.cardioFields,
        sets: ex.sets ?? 3,
        reps: ex.reps ?? 10,
        weight: ex.weight,
        extras: (ex.extras as Record<string, string>) ?? {},
      }
    })
  )
  const [showSearch, setShowSearch] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settingActive, setSettingActive] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
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

  async function handleSaveEdit() {
    if (!name.trim()) {
      setError('루틴 이름을 입력해주세요')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      await supabase.from('routines').update({ name: name.trim() }).eq('id', routine.id)

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
      await supabase.from('routine_exercises').delete().eq('routine_id', routine.id)
      if (rows.length > 0) await supabase.from('routine_exercises').insert(rows)

      setRoutine((r) => ({
        ...r,
        name: name.trim(),
        exercises: rows.map((row, i) => ({ ...row, id: exercises[i].dndId })),
      }))
      setEditing(false)
    } catch (e) {
      setError((e as Error).message ?? '저장에 실패했어요')
    } finally {
      setSaving(false)
    }
  }

  async function handleSetActive() {
    setSettingActive(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('로그인이 필요합니다')
      await supabase.from('routines').update({ is_active: false }).eq('user_id', user.id)
      await supabase.from('routines').update({ is_active: true }).eq('id', routine.id)
      setRoutine((r) => ({ ...r, is_active: true }))
    } catch (e) {
      setError((e as Error).message ?? '설정에 실패했어요')
    } finally {
      setSettingActive(false)
    }
  }

  async function handleDelete() {
    if (!confirm('이 루틴을 삭제하면 복구할 수 없어요. 계속할까요?')) return
    setDeleting(true)
    try {
      const supabase = createClient()
      await supabase.from('routines').delete().eq('id', routine.id)
      router.push('/routine')
    } catch (e) {
      setError((e as Error).message ?? '삭제에 실패했어요')
      setDeleting(false)
    }
  }

  const estimatedMin = calcEstimatedMinutes(
    (routine.exercises ?? []).map((e) => ({ sets: e.sets, reps: e.reps, exerciseType: e.extras ? 'cardio' : 'strength', extras: e.extras }))
  )

  return (
    <div className="px-4 pt-2 pb-8 flex flex-col gap-4">
      {editing ? (
        <>
          {/* Edit mode */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[var(--muted)] px-1">루틴 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-[15px] bg-[var(--surface)] text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
            />
          </div>

          {exercises.length > 0 && <EstimatedTime exercises={exercises} />}

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

          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--muted)] text-[15px] font-medium active:opacity-70 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            운동 추가
          </button>

          {error && <p className="text-[13px] text-red-500 text-center">{error}</p>}

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { setEditing(false); setName(routine.name) }}>
              취소
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? '저장 중…' : '저장'}
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* View mode */}
          <div className="flex items-center justify-between">
            <div>
              {estimatedMin > 0 && (
                <p className="text-[13px] text-[var(--muted)]">예상 시간: 약 {estimatedMin}분</p>
              )}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="text-[14px] font-medium text-[var(--accent)] active:opacity-70 transition-opacity"
            >
              수정
            </button>
          </div>

          <Card className="px-4 py-1">
            {(routine.exercises ?? []).length === 0 ? (
              <p className="text-[14px] text-[var(--muted)] py-4 text-center">운동이 없어요</p>
            ) : (
              (routine.exercises ?? []).map((ex) => (
                <ExerciseItem key={ex.id} exercise={ex} />
              ))
            )}
          </Card>

          {error && <p className="text-[13px] text-red-500 text-center">{error}</p>}

          {!routine.is_active && (
            <Button onClick={handleSetActive} disabled={settingActive}>
              {settingActive ? '설정 중…' : '활성 루틴으로 설정'}
            </Button>
          )}
          {routine.is_active && (
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-[var(--accent)] text-[13px] font-semibold">✓ 현재 활성 루틴</span>
            </div>
          )}

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-center text-[14px] text-red-500 font-medium active:opacity-70 transition-opacity disabled:opacity-40"
          >
            {deleting ? '삭제 중…' : '루틴 삭제'}
          </button>
        </>
      )}

      {showSearch && (
        <ExerciseSearchSheet
          onSelect={handleAddExercise}
          onClose={() => setShowSearch(false)}
          selectedIds={exercises.map((e) => e.exerciseId)}
        />
      )}
    </div>
  )
}
