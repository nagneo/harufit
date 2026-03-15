interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const base = 'bg-[var(--surface)] rounded-2xl shadow-sm'
  return onClick ? (
    <button className={`${base} w-full text-left active:opacity-70 transition-opacity ${className}`} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div className={`${base} ${className}`}>{children}</div>
  )
}
