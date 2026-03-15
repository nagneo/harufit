'use client'

import { useState } from 'react'
import { MUSCLE_GROUPS, searchExercises } from '@/lib/exercises'
import type { ExerciseDefinition, MuscleGroup } from '@/lib/exercises'

interface ExerciseSearchSheetProps {
  onSelect: (exercise: ExerciseDefinition) => void
  onClose: () => void
  selectedIds: string[]
}

export default function ExerciseSearchSheet({ onSelect, onClose, selectedIds }: ExerciseSearchSheetProps) {
  const [query, setQuery] = useState('')
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null)

  const results = searchExercises(query, muscle)

  return (
    <div className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col">
      {/* Header */}
      <div className="flex items-center h-14 px-4 gap-3 border-b border-[var(--border)]">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-9 h-9 -ml-2 rounded-full active:bg-[var(--border)] transition-colors"
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            width="16" height="16" viewBox="0 0 16 16" fill="none"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="운동 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[15px] bg-[var(--surface)] placeholder:text-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-shadow"
          />
        </div>
      </div>

      {/* Muscle group filter pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none shrink-0">
        <button
          onClick={() => setMuscle(null)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
            muscle === null
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'
          }`}
        >
          전체
        </button>
        {MUSCLE_GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setMuscle(muscle === g ? null : g)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
              muscle === g
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto">
        {results.length === 0 ? (
          <p className="text-center text-[var(--muted)] text-[14px] mt-16">검색 결과가 없어요</p>
        ) : (
          <ul className="px-4 pb-8 flex flex-col gap-1">
            {results.map((ex) => {
              const alreadyAdded = selectedIds.includes(ex.id)
              return (
                <li key={ex.id}>
                  <button
                    onClick={() => {
                      onSelect(ex)
                      onClose()
                    }}
                    disabled={alreadyAdded}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-[var(--surface)] active:opacity-70 transition-opacity disabled:opacity-40 text-left"
                  >
                    <div>
                      <p className="text-[15px] font-medium">{ex.name}</p>
                      <p className="text-[12px] text-[var(--muted)] mt-0.5">{ex.muscleGroup} · {ex.nameEn}</p>
                    </div>
                    {alreadyAdded ? (
                      <span className="text-[12px] text-[var(--muted)]">추가됨</span>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 3V15M3 9H15" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
