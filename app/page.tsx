import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChatDemo } from "@/components/chat";

export default function Home() {
  return (
<main
      className="
        pt-20                          /* 推开固定 Header 的高度（5rem） */
        min-h-[calc(100vh-5rem)]       /* 剩余可视区高度 */
        grid place-items-center        /* 上下左右居中 */
        px-4                           /* 小屏留白 */
      "
    >
      <div className="w-full max-w-[80ch] mb-4">
        <ChatDemo />
      </div>
    </main>
  );
}
