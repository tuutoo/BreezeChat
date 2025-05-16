"use client"

import * as React from "react"
import { Volume2Icon, CircleStopIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ReadAloudButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  className?: string
}

export function ReadAloudButton({
  text,
  className,
  ...props
}: ReadAloudButtonProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const handlePlay = React.useCallback(async () => {
    if (!text) return
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      return
    }
    setIsPlaying(true)
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    audio.play()
  }, [text, isPlaying])

  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={isPlaying ? "Stop reading aloud" : "Read aloud"}
      className={cn(
        "relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
        className
      )}
      onClick={handlePlay}
      {...props}
    >
      {isPlaying ? (
        <CircleStopIcon className="h-3 w-3" />
      ) : (
        <Volume2Icon className="h-3 w-3" />
      )}
      <span className="sr-only">{isPlaying ? "Stop reading aloud" : "Read aloud"}</span>
    </Button>
  )
}