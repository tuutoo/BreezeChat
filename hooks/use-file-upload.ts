"use client"

import { useState, useCallback, useRef } from 'react'

export interface UploadedFile {
  id: string
  file: File
  preview?: string
}

export interface UseFileUploadOptions {
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedTypes?: string[]
  onError?: (error: string) => void
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxFiles = 5,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    acceptedTypes = ['image/*', 'text/*', 'application/pdf', '.doc', '.docx'],
    onError
  } = options

  const [files, setFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB limit`
    }

    // Check file type
    const isAccepted = acceptedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.replace('*', '')
        return file.type.startsWith(baseType)
      }
      return file.type === type || file.name.toLowerCase().endsWith(type)
    })

    if (!isAccepted) {
      return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
    }

    return null
  }, [maxFileSize, acceptedTypes])

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: UploadedFile[] = []

    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        onError?.(error)
        continue
      }

      // Check if file already exists (by name and size)
      const exists = files.some(f => f.file.name === file.name && f.file.size === file.size)
      if (exists) {
        onError?.(`File "${file.name}" already added`)
        continue
      }

      validFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      })
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles])
    }
  }, [files, maxFiles, validateFile, onError])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }, [])

  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }, [files])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [addFiles])

  // Handle paste from clipboard
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    const fileItems: File[] = []

    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file) {
          fileItems.push(file)
        }
      }
    }

    if (fileItems.length > 0) {
      event.preventDefault()
      addFiles(fileItems)
    }
  }, [addFiles])

  // Handle drag and drop
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer.files
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }, [addFiles])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    openFileDialog,
    handleFileSelect,
    handlePaste,
    handleDrop,
    handleDragOver,
    fileInputRef,
    canAddMore: files.length < maxFiles
  }
}
