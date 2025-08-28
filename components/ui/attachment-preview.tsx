"use client"

import React from "react"
import { X, File, Image, Video, Music, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AttachmentPreviewProps {
  file: File
  onRemove: () => void
  className?: string
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  file,
  onRemove,
  className
}) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.startsWith('video/')) return Video
    if (file.type.startsWith('audio/')) return Music
    if (file.type.includes('text/') || file.type.includes('document')) return FileText
    return File
  }

  const FileIcon = getFileIcon()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn(
      "relative group bg-muted rounded-lg p-2 border border-border hover:border-border/80 transition-colors",
      className
    )}>
      {/* Remove button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3" />
      </Button>

      <div className="flex items-center space-x-3">
        {/* Preview or Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted-foreground/10 flex items-center justify-center">
          {previewUrl && !error ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-cover"
              onError={() => setError(true)}
            />
          ) : (
            <FileIcon className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
    </div>
  )
}
