'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Database, Layers } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">系统管理</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/models">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                模型管理
              </CardTitle>
              <CardDescription>
                管理 AI 模型配置，包括模型参数和提示词设置
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/scene">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                场景管理
              </CardTitle>
              <CardDescription>
                管理场景配置，包括场景名称、描述和提示词设置
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

      </div>
    </div>
  )
}