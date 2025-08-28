"use client"

import React from "react"
import { Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageMessageProps {
  image: string // base64 data URL
  prompt?: string
  createdAt?: string
  className?: string
}

export const ImageMessage: React.FC<ImageMessageProps> = ({
  image,
  prompt,
  createdAt,
  className
}) => {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = image
    link.download = `generated-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

      const handleOpenInNewTab = () => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.title = 'Generated Image'
      newWindow.document.head.innerHTML = `
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
            border-radius: 8px;
          }
        </style>
      `
      newWindow.document.body.innerHTML = `<img src="${image}" alt="Generated Image" />`
    }
  }

  const formattedTime = createdAt ? new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }) : null

  return (
    <div className={cn("group relative max-w-md", className)}>
      <div className="relative overflow-hidden rounded-lg border bg-card">
        <img
          src={image}
          alt={prompt || "Generated image"}
          className="w-full h-auto object-cover cursor-pointer transition-opacity hover:opacity-90"
          onClick={handleOpenInNewTab}
        />

        {/* Overlay controls */}
        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-1 bg-white/90 hover:bg-white text-black"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenInNewTab}
            className="flex items-center gap-1 bg-white/90 hover:bg-white text-black"
          >
            <ExternalLink className="h-4 w-4" />
            View Full
          </Button>
        </div>
      </div>
    </div>
  )
}
