import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'w-full py-3.5 text-[15px] font-semibold rounded-full transition-opacity active:opacity-70 disabled:opacity-40'

  const variants = {
    primary: 'bg-[var(--accent)] text-white',
    ghost: 'bg-transparent text-[var(--accent)]',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
