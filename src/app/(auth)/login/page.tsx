'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요')
      setLoading(false)
      return
    }
    router.push('/routine')
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Wordmark */}
      <div className="flex flex-col items-center gap-2 pt-8">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[var(--accent)]" />
          <span className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            harufit
          </span>
        </div>
        <p className="text-[14px] text-[var(--muted)]">오늘의 건강을 기록하세요</p>
      </div>

      {/* Card */}
      <div className="bg-[var(--surface)] rounded-2xl shadow-sm p-6 flex flex-col gap-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="이메일"
            type="email"
            placeholder="hello@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            id="password"
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && (
            <p className="text-[13px] text-red-500 text-center">{error}</p>
          )}
          <div className="pt-1">
            <Button type="submit" disabled={loading}>
              {loading ? '로그인 중…' : '로그인'}
            </Button>
          </div>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-center text-[14px] text-[var(--muted)]">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-[var(--accent)] font-medium">
          회원가입
        </Link>
      </p>
    </div>
  )
}
