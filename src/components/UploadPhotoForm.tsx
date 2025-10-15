'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from './Button'

interface UploadPhotoFormProps {
  bandId: string
}

export default function UploadPhotoForm({ bandId }: UploadPhotoFormProps) {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [caption, setCaption] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)

    // Create preview
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError('Please select an image file')
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
        .from('band-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('band-photos')
        .getPublicUrl(fileName)

      // Get current max photo_order
      const { data: existingPhotos } = await supabase
        .from('band_photos')
        .select('photo_order')
        .eq('band_id', bandId)
        .order('photo_order', { ascending: false })
        .limit(1)

      const nextOrder = (existingPhotos?.[0]?.photo_order || 0) + 1

      // If this is marked as primary, unset any existing primary photos
      if (isPrimary) {
        await supabase
          .from('band_photos')
          .update({ is_primary: false })
          .eq('band_id', bandId)
          .eq('is_primary', true)
      }

      // Insert photo record
      const { error: insertError } = await supabase
        .from('band_photos')
        .insert({
          band_id: bandId,
          url: publicUrl,
          caption: caption.trim() || null,
          is_primary: isPrimary,
          photo_order: nextOrder
        })

      if (insertError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('band-photos').remove([fileName])
        throw new Error(`Failed to save photo: ${insertError.message}`)
      }

      // Reset form
      setCaption('')
      setIsPrimary(false)
      setFile(null)
      setPreview(null)
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
        Upload New Photo
      </h3>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">Photo uploaded successfully!</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="photo-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image File * (JPG, PNG, WebP)
            </label>
            <input
              id="photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 dark:file:bg-indigo-900 file:text-indigo-700 dark:file:text-indigo-300 file:font-medium hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
            />
            {file && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div>
            <label htmlFor="photo-caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Caption
            </label>
            <input
              id="photo-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Optional caption..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is-primary"
              type="checkbox"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="is-primary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Set as primary photo (displayed on band page header)
            </label>
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </Button>
        </div>

        {preview && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </p>
            <img
              src={preview}
              alt="Preview"
              className="w-full aspect-square object-cover rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
        )}
      </div>
    </form>
  )
}
