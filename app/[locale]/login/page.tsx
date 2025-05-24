'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { usePathname } from 'next/navigation'

export default function LocalizedLoginPage() {
  const [password, setPassword] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  // Extract locale from pathname
  const locale = pathname.split('/')[1]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        router.push(`/${locale}/admin`)
      } else {
        toast({
          title: locale === 'en' ? 'Error' : '错误',
          description: locale === 'en' ? 'Incorrect password' : '密码错误',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: locale === 'en' ? 'Error' : '错误',
        description: locale === 'en' ? 'Login failed' : '登录失败',
        variant: 'destructive',
      })
    }
  }

  const loginText = {
    'zh': '登录',
    'en': 'Login',
    'ja': 'ログイン',
    'ko': '로그인'
  }

  const passwordPromptText = {
    'zh': '请输入管理员密码',
    'en': 'Please enter the admin password',
    'ja': '管理者パスワードを入力してください',
    'ko': '관리자 비밀번호를 입력하세요'
  }

  const submitText = {
    'zh': '提交',
    'en': 'Submit',
    'ja': '送信',
    'ko': '제출'
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{loginText[locale as keyof typeof loginText] || loginText['en']}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {passwordPromptText[locale as keyof typeof passwordPromptText] || passwordPromptText['en']}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            {submitText[locale as keyof typeof submitText] || submitText['en']}
          </Button>
        </form>
      </div>
    </div>
  )
}
