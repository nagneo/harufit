import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-[var(--muted)] px-1">
        {label}
      </label>
      <input
        id={id}
        className={`
          w-full px-4 py-3 rounded-xl text-[15px]
          bg-[var(--background)] text-[var(--foreground)]
          placeholder:text-[var(--muted)]
          outline-none
          focus:ring-2 focus:ring-[var(--accent)]
          transition-shadow
          ${className}
        `}
        {...props}
      />
    </div>
  )
}
