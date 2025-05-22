'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Layers, Settings, Bot } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">系统管理</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Link href="/admin/providers">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                提供商管理
              </CardTitle>
              <CardDescription>
                管理 AI 提供商配置，包括提供商名称、API 密钥和状态等
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

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
    </div>
  )
}