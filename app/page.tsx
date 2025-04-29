import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-3xl font-extrabold tracking-tight">
            LinguaLens 翻译助手
          </h1>
          <p className="text-gray-600 mt-1">
            智能双向翻译，支持多场景风格切换
          </p>
        </header>

        <main className="flex flex-col space-y-8">
          {/* 翻译表单 Card */}
          <Card>
            <CardHeader>
              <CardTitle>翻译</CardTitle>
            </CardHeader>
            <CardContent>
              
            </CardContent>
          </Card>

          {/* 历史记录 Card */}
          <Card>
            <CardHeader>
              <CardTitle>历史记录</CardTitle>
            </CardHeader>
            <CardContent>
               
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
