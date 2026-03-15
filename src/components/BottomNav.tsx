'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    href: '/dashboard',
    label: '홈',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M2 9.5L11 2L20 9.5V20H14V14H8V20H2V9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/routine',
    label: '루틴',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M2 11H8M14 11H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="1" y="8.5" width="4" height="5" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="17" y="8.5" width="4" height="5" rx="2" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: '/diet',
    label: '식단',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M7 2V9C7 10.657 8.343 12 10 12H12C13.657 12 15 10.657 15 9V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M11 12V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M18 2C18 2 18 6.5 16 8.5C15 9.5 14 10 14 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/history',
    label: '기록',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 2V6M15 2V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M2 9H20" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="7" cy="14" r="1.2" fill="currentColor" />
        <circle cx="11" cy="14" r="1.2" fill="currentColor" />
        <circle cx="15" cy="14" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-[var(--surface)] border-t border-[var(--border)] pb-safe">
      <div className="flex h-16">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5"
            >
              <span className={active ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}>
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${active ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
