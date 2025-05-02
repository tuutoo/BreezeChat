'use client';
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useChat } from '@ai-sdk/react';
import ChatDemo from "@/components/chat-demo";
export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({});
 
  return (

    <main
      className="
        pt-20                          
        min-h-[calc(100vh-5rem)]      
        grid place-items-center      
        px-4                         
      "
    >
      <div className="w-full max-w-[80ch] mb-4">
         <ChatDemo />
      </div>
    </main>
  );
}
