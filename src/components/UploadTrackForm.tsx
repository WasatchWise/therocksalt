'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from './Button'

interface UploadTrackFormProps {
  bandId: string
}

export default function UploadTrackForm({ bandId }: UploadTrackFormProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [trackType, setTrackType] = useState<'demo' | 'single' | 'album_track' | 'live'>('demo')
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError('Please select an audio file')
      return
    }

    if (!title.trim()) {
      setError('Please enter a track title')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()

      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${bandId}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('band-tracks')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('band-tracks')
        .getPublicUrl(fileName)

      // Insert track record
      const { error: insertError } = await supabase
        .from('band_tracks')
        .insert({
          band_id: bandId,
          title: title.trim(),
          description: description.trim() || null,
          track_type: trackType,
          file_url: publicUrl,
          play_count: 0,
          is_featured: false
        })

      if (insertError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('band-tracks').remove([fileName])
        throw new Error(`Failed to save track: ${insertError.message}`)
      }

      // Reset form
      setTitle('')
      setDescription('')
      setTrackType('demo')
      setFile(null)
      setSuccess(true)

      // Refresh the page data
      router.refresh()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Upload New Track
      </h3>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">Track uploaded successfully!</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Track Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Song title"
          />
        </div>

        <div>
          <label htmlFor="trackType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Track Type
          </label>
          <select
            id="trackType"
            value={trackType}
            onChange={(e) => setTrackType(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="demo">Demo</option>
            <option value="single">Single</option>
            <option value="album_track">Album Track</option>
            <option value="live">Live Recording</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Optional description..."
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Audio File * (MP3, WAV, M4A)
        </label>
        <input
          id="file"
          type="file"
          accept="audio/mpeg,audio/wav,audio/x-m4a,audio/mp4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 dark:file:bg-indigo-900 file:text-indigo-700 dark:file:text-indigo-300 file:font-medium hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
        />
        {file && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <Button type="submit" disabled={uploading} className="w-full md:w-auto">
        {uploading ? 'Uploading...' : 'Upload Track'}
      </Button>
    </form>
  )
}
