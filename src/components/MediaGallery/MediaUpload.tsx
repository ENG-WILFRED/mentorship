
'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, X, Plus, Check } from 'lucide-react'
import type { MediaItem } from './types'
// Note: Cloudinary upload route is server-side; no client token required for this endpoint.

type UploadForm = {
  url: string
  thumbnail: string
  caption: string
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
  category: 'MISSION' | 'SERMON' | 'EVENT' | 'STUDENT'
  date: string
  location: string
  description: string
  tags: string[]
}

interface MediaUploadProps {
  userId: number
  onUpload: (mediaData: Partial<MediaItem>) => Promise<void>
}

export function MediaUpload({ userId, onUpload }: MediaUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<UploadForm>({
    url: '',
    thumbnail: '',
    caption: '',
    type: 'IMAGE',
    category: 'MISSION',
    date: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    tags: []
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [successCountdown, setSuccessCountdown] = useState(10)
  const successTimerRef = useRef<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Require either a selected file or a remote url
      if (!selectedFile && !formData.url) {
        alert('Please provide a URL or select a file to upload.')
        setLoading(false)
        return
      }
      // If user selected a local file, upload to Cloudinary first (fallback for images and videos until YouTube route implemented)
      let cloudinaryPublicId: string | undefined
      let uploadedUrl: string | undefined
      if (selectedFile) {
        // Use YouTube upload endpoint for video files, otherwise Cloudinary for images
        if (selectedFile.type.startsWith('video/')) {
          const fd = new FormData()
          fd.append('file', selectedFile)
          fd.append('title', formData.caption)
          fd.append('description', formData.description || '')

          const uploadResponse = await fetch('/api/media/upload/youtube', { method: 'POST', body: fd })
          if (!uploadResponse.ok) {
            const errData = await uploadResponse.json().catch(() => ({}))
            throw new Error(errData.error || `YouTube upload failed: ${uploadResponse.status}`)
          }

          const json = await uploadResponse.json()
          uploadedUrl = json.videoUrl || formData.url
          // For YouTube, set youtubeId and thumbnail
          const youtubeId = json.youtubeId || undefined
          const thumbnailFromYouTube = json.thumbnail || undefined
          // set these fields on payload below
          // store youtube values in variables
          // To keep typing simple, assign to uploadedUrl and cloudinaryPublicId variables already used
          cloudinaryPublicId = undefined
          // set preview to returned thumbnail where available
          if (thumbnailFromYouTube) setPreviewUrl(thumbnailFromYouTube)
            // Attach youtube metadata to formData for onUpload below by adding temporary properties
            ; (formData as any)._youtubeId = youtubeId
            ; (formData as any)._videoUrl = uploadedUrl
        } else {
          const fd = new FormData()
          fd.append('file', selectedFile)

          const uploadResponse = await fetch('/api/media/upload', {
            method: 'POST',
            body: fd
          })

          if (!uploadResponse.ok) {
            const errData = await uploadResponse.json().catch(() => ({}))
            throw new Error(errData.error || `Upload failed: ${uploadResponse.status}`)
          }

          const json = await uploadResponse.json()
          uploadedUrl = json.secure_url || json.url
          cloudinaryPublicId = json.public_id || json.publicId || undefined
          if (!previewUrl && uploadedUrl) setPreviewUrl(uploadedUrl)
        }
      }
      await onUpload({
        ...formData,
        uploaderId: userId,
        tags: formData.tags.map((t, i) => ({ id: i + 1, name: t })),
        url: uploadedUrl || formData.url,
        thumbnail: previewUrl || formData.thumbnail || uploadedUrl || undefined,
        cloudinaryPublicId: cloudinaryPublicId || undefined,
        youtubeId: (formData as any)._youtubeId || undefined,
        videoUrl: (formData as any)._videoUrl || undefined
      })
      // set final progress to 100% to indicate complete
      setUploadProgress(100)

      // Reset form
      setFormData({
        url: '',
        thumbnail: '',
        caption: '',
        type: 'IMAGE',
        category: 'MISSION',
        date: new Date().toISOString().split('T')[0],
        location: '',
        description: '',
        tags: []
      })
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        setObjectUrl(null)
      }
      setSelectedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      // Begin success UI instead of closing immediately
      setUploadSuccess(true)
      setSuccessCountdown(10)
      // Start countdown interval to close modal automatically after 10s
      if (successTimerRef.current) window.clearInterval(successTimerRef.current)
      successTimerRef.current = window.setInterval(() => setSuccessCountdown((s) => s - 1), 1000)
    } catch (error: any) {
      console.error('Upload failed:', error)
      const message = error?.message || 'Failed to upload media. Please try again.'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (successTimerRef.current) {
      window.clearInterval(successTimerRef.current)
      successTimerRef.current = null
    }
    setUploadSuccess(false)
    setSuccessCountdown(10)
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      setObjectUrl(null)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setIsOpen(false)
    setUploadProgress(null)
    setLoading(false)
  }

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
      // Clear any running success timer
      if (successTimerRef.current) window.clearInterval(successTimerRef.current)
    }
  }, [objectUrl])

  // Close modal when countdown reaches 0
  useEffect(() => {
    if (!uploadSuccess) return
    if (successCountdown <= 0) {
      if (successTimerRef.current) {
        window.clearInterval(successTimerRef.current)
        successTimerRef.current = null
      }
      setUploadSuccess(false)
      setSuccessCountdown(10)
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        setObjectUrl(null)
      }
      setSelectedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setIsOpen(false)
      setUploadProgress(null)
      setLoading(false)
    }
  }, [successCountdown, uploadSuccess, objectUrl])

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput('')
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setObjectUrl(url)
      // Try to auto-detect type based on file: if it's a video, set type
      if (file.type.startsWith('video/')) {
        setFormData({ ...formData, type: 'VIDEO' })
      } else if (file.type.startsWith('image/')) {
        setFormData({ ...formData, type: 'IMAGE' })
      }
    } else {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        setObjectUrl(null)
      }
      setPreviewUrl(null)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true)
          setUploadSuccess(false)
          setUploadProgress(null)
          setSuccessCountdown(10)
        }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
      >
        <Upload className="w-5 h-5" />
        Upload Media
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Upload New Media</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploadSuccess ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-[72px] h-[72px] rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mt-4">Upload Successful</h3>
            <p className="text-sm text-gray-600 mt-2">Your media upload completed successfully.</p>
            {previewUrl && (
              <div className="mx-auto mt-4 w-36 h-20 overflow-hidden rounded border">
                {formData.type === 'VIDEO' ? (
                  <video src={previewUrl} className="w-full h-full object-cover" />
                ) : (
                  <img src={previewUrl} className="w-full h-full object-cover" />
                )}
              </div>
            )}
            <div className="mt-4 text-xs text-gray-500">Closing in {successCountdown}s...</div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  // dismiss immediately
                  if (successTimerRef.current) window.clearInterval(successTimerRef.current)
                  successTimerRef.current = null
                  setUploadSuccess(false)
                  setSuccessCountdown(10)
                  setIsOpen(false)
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* File upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Upload File <span className="text-red-500">*</span>
              </label>

              {/* Hidden input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />

              {/* Upload Area */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className={`
        flex items-center justify-center gap-2
        px-4 py-3 rounded-lg border
        transition-all
        ${loading
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow cursor-pointer'
                    }
      `}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="font-medium">Choose File</span>
                    </>
                  )}
                </button>

                {selectedFile && (
                  <div className="flex-1 flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      {formData.type === 'VIDEO' ? (
                        <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 9v6l5-3-5-3zm8.222-3H5.778C4.8 6 4 6.6 4 7.333v9.334C4 17.4 4.8 18 5.778 18h12.444C19.2 18 20 17.4 20 16.667V7.333C20 6.6 19.2 6 18.222 6z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 5h13v7h2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-2H4V5z" />
                            <path d="M8 11l-3 4h11l-4-6-3 4-1-2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(1)} MB • {formData.type.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (objectUrl) URL.revokeObjectURL(objectUrl)
                        setObjectUrl(null)
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* URL */}


            {/* Thumbnail (optional) */}

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption *
              </label>
              <input
                type="text"
                required
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Enter a descriptive caption"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-500"
              />
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                >
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                >
                  <option value="MISSION">Mission</option>
                  <option value="SERMON">Sermon</option>
                  <option value="EVENT">Event</option>
                  <option value="STUDENT">Student</option>
                </select>
              </div>
            </div>

            {/* Date and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Nairobi, Kenya"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter a detailed description"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Type a tag and press Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Media
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}