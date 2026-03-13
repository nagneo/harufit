'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
        <p className="text-[14px] text-[var(--muted)]">건강한 하루를 시작하세요</p>
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
            autoComplete="new-password"
          />
          <Input
            id="confirm"
            label="비밀번호 확인"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          <div className="pt-1">
            <Button type="submit">회원가입</Button>
          </div>
        </form>
      </div>

      {/* Footer link */}
      <p className="text-center text-[14px] text-[var(--muted)]">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-[var(--accent)] font-medium">
          로그인
        </Link>
      </p>
    </div>
  )
}
