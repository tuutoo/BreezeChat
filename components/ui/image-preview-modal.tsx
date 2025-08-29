"use client"

import React from "react"
import { X, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImagePreviewModalProps {
  image: string // base64 data URL or image URL
  prompt?: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  image,
  prompt,
  isOpen,
  onClose,
  className
}) => {
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)

  // 重置缩放和旋转当图片改变时
  React.useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setRotation(0)
    }
  }, [image, isOpen])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = image
    link.download = `generated-image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25))
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case '+':
      case '=':
        e.preventDefault()
        handleZoomIn()
        break
      case '-':
        e.preventDefault()
        handleZoomOut()
        break
      case 'r':
      case 'R':
        e.preventDefault()
        handleRotate()
        break
      case '0':
        e.preventDefault()
        handleReset()
        break
    }
  }, [isOpen, onClose])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // 阻止body滚动当模态框打开时
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4",
        className
      )}
      onClick={onClose}
    >
      {/* 模态框容器 - 80%窗口大小 */}
      <div
        className="relative w-[80vw] h-[80vh] bg-background rounded-lg shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部控制栏 */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">图片预览</h3>
            {prompt && (
              <span className="text-sm text-muted-foreground max-w-md truncate">
                {prompt}
              </span>
            )}
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.25}
              title="缩小 (-)"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title="放大 (+)"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              title="重置 (0)"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title="下载"
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              title="关闭 (Esc)"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 图片显示区域 */}
        <div className="flex-1 overflow-auto bg-muted/20 flex items-center justify-center p-4">
          <div
            className="relative transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            <img
              src={image}
              alt={prompt || "预览图片"}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              draggable={false}
            />
          </div>
        </div>

        {/* 底部提示 */}
        <div className="p-2 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="text-xs text-muted-foreground text-center space-x-4">
            <span>快捷键: Esc 关闭</span>
            <span>+/- 缩放</span>
            <span>R 旋转</span>
            <span>0 重置</span>
          </div>
        </div>
      </div>
    </div>
  )
}
