"use client"

import React from "react"
import { Upload, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AttachmentPreview } from "@/components/ui/attachment-preview"
import { useFileUpload, type UseFileUploadOptions } from "@/hooks/use-file-upload"
import { cn } from "@/lib/utils"

interface FileUploadAreaProps extends UseFileUploadOptions {
  className?: string
  compact?: boolean
  onFilesChange?: (files: File[]) => void
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  className,
  compact = false,
  onFilesChange,
  ...uploadOptions
}) => {
  const {
    files,
    removeFile,
    openFileDialog,
    handleFileSelect,
    handlePaste,
    handleDrop,
    handleDragOver,
    fileInputRef,
    canAddMore
  } = useFileUpload(uploadOptions)

  // Notify parent of files change only when files are added, not on every change
  const prevFilesLength = React.useRef(0)
  React.useEffect(() => {
    if (files.length > prevFilesLength.current) {
      const newFiles = files.slice(prevFilesLength.current).map(f => f.file)
      onFilesChange?.(newFiles)
    }
    prevFilesLength.current = files.length
  }, [files, onFilesChange])

  // Add paste event listener
  React.useEffect(() => {
    const handlePasteEvent = (event: ClipboardEvent) => {
      // Only handle paste if the upload area or its children are focused
      const activeElement = document.activeElement
      const container = document.querySelector('[data-file-upload-container]')

      if (container?.contains(activeElement)) {
        handlePaste(event)
      }
    }

    document.addEventListener('paste', handlePasteEvent)
    return () => document.removeEventListener('paste', handlePasteEvent)
  }, [handlePaste])

  if (compact) {
    return (
      <div
        className={cn("relative", className)}
        data-file-upload-container
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept={uploadOptions.acceptedTypes?.join(',')}
        />

        {/* Compact upload button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openFileDialog}
          disabled={!canAddMore}
          className="h-8 w-8 p-0"
          title="上传文件 (支持剪切板粘贴)"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* File previews - show in a horizontal scroll if compact */}
        {files.length > 0 && (
          <div className="absolute bottom-full left-0 mb-2 flex space-x-2 max-w-sm overflow-x-auto">
            {files.map((file) => (
              <AttachmentPreview
                key={file.id}
                file={file.file}
                onRemove={() => removeFile(file.id)}
                className="flex-shrink-0 w-24"
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn("w-full", className)}
      data-file-upload-container
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept={uploadOptions.acceptedTypes?.join(',')}
      />

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={cn(
          "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center transition-colors",
          "hover:border-muted-foreground/50 hover:bg-muted/50",
          "focus-within:border-primary focus-within:bg-muted/50"
        )}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            disabled={!canAddMore}
          >
            <Paperclip className="mr-2 h-4 w-4" />
            选择文件
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            或拖拽文件到此处，支持从剪切板粘贴
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            最多 {uploadOptions.maxFiles || 5} 个文件，单个文件最大 {Math.round((uploadOptions.maxFileSize || 10485760) / (1024 * 1024))}MB
          </p>
        </div>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-foreground">附件 ({files.length})</h4>
          <div className="grid grid-cols-1 gap-2">
            {files.map((file) => (
              <AttachmentPreview
                key={file.id}
                file={file.file}
                onRemove={() => removeFile(file.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
