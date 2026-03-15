'use client'

import { useRouter } from 'next/navigation'
import RoutineCard from './RoutineCard'
import type { Routine } from '@/types/routine'

interface RoutineListClientProps {
  routines: Routine[]
}

export default function RoutineListClient({ routines }: RoutineListClientProps) {
  const router = useRouter()

  return (
    <div className="relative min-h-[calc(100vh-56px-80px)]">
      {routines.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-3 text-center px-8">
          <p className="text-[17px] font-semibold">아직 루틴이 없어요</p>
          <p className="text-[14px] text-[var(--muted)]">
            아래 + 버튼을 눌러 첫 번째 루틴을 만들어보세요
          </p>
        </div>
      ) : (
        <div className="px-4 pt-2 pb-4 flex flex-col gap-3">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onClick={() => router.push(`/routine/${routine.id}`)}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => router.push('/routine/new')}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[var(--accent)] shadow-lg flex items-center justify-center active:opacity-80 transition-opacity z-10"
        aria-label="새 루틴 만들기"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 4V18M4 11H18" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
