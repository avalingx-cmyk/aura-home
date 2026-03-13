'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  folder?: string
}

export default function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  folder = 'products'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remainingSlots = maxImages - value.length

    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    const filesToUpload = fileArray.slice(0, remainingSlots)
    setUploading(true)

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Convert to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        // Upload to API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, folder })
        })

        const data = await response.json()
        return data.success ? data.url : null
      })

      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter(Boolean) as string[]

      if (successfulUploads.length > 0) {
        onChange([...value, ...successfulUploads])
      }

      if (successfulUploads.length < filesToUpload.length) {
        alert('Some images failed to upload')
      }
    } catch (error) {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }, [value, maxImages, folder, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }, [handleUpload])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...value]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return
    const newImages = [...value]
    const [removed] = newImages.splice(from, 1)
    newImages.splice(to, 0, removed)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading || value.length >= maxImages}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-600">
              {value.length >= maxImages 
                ? 'Maximum images reached'
                : 'Drop images here or click to upload'
              }
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {value.length}/{maxImages} images
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {value.map((url, index) => (
            <div key={url} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1 bg-white rounded text-xs"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 bg-red-500 text-white rounded text-xs"
                  title="Remove"
                >
                  ✕
                </button>
                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1 bg-white rounded text-xs"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>

              {/* First Image Badge */}
              {index === 0 && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}