'use client'

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Bot, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AdminPage() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/login')
      } else {
        toast({
          title: '错误',
          description: '登出失败',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: '错误',
        description: '登出失败',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">系统管理</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          登出
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/models">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                模型管理
              </CardTitle>
              <CardDescription>
                管理 AI 模型配置，包括模型名称、提供商和状态等
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/scene">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                场景管理
              </CardTitle>
              <CardDescription>
                管理场景配置，包括场景名称、描述和状态等
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
      <Toaster />
    </div>
  )
}