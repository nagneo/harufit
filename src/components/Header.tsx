'use client'

import Link from 'next/link'

interface HeaderProps {
  title: string
  backHref?: string
  right?: React.ReactNode
}

export default function Header({ title, backHref, right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-[var(--background)] flex items-center h-14 px-4">
      {backHref ? (
        <Link href={backHref} className="flex items-center justify-center w-9 h-9 -ml-2 rounded-full active:bg-[var(--border)] transition-colors">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      ) : (
        <div className="w-7" />
      )}
      <h1 className="flex-1 text-center text-[17px] font-semibold">{title}</h1>
      <div className="w-7 flex justify-end">{right}</div>
    </header>
  )
}
