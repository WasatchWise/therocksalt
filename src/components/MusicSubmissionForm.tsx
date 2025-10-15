'use client'

import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { submitMusicSubmission } from '@/app/submit/actions'
import { GENRE_OPTIONS, REFERRAL_SOURCE_OPTIONS } from '@/types/submission'

interface FormErrors {
  [key: string]: string
}

export default function MusicSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const formRef = useRef<HTMLFormElement>(null)

  // Character counters
  const [bioLength, setBioLength] = useState(0)
  const [descriptionLength, setDescriptionLength] = useState(0)

  // File previews
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [musicFileName, setMusicFileName] = useState<string | null>(null)

  // Additional genres
  const [selectedAdditionalGenres, setSelectedAdditionalGenres] = useState<string[]>([])

  const validateForm = (formData: FormData): FormErrors => {
    const errors: FormErrors = {}

    // Required fields
    const bandName = formData.get('bandName') as string
    const hometown = formData.get('hometown') as string
    const bio = formData.get('bio') as string
    const contactName = formData.get('contactName') as string
    const contactEmail = formData.get('contactEmail') as string
    const primaryGenre = formData.get('primaryGenre') as string
    const agreeToTerms = formData.get('agreeToTerms') as string

    if (!bandName || bandName.trim().length < 2) {
      errors.bandName = 'Band name must be at least 2 characters'
    }

    if (!hometown || !/^[\w\s]+,\s*[A-Z]{2}$/i.test(hometown)) {
      errors.hometown = 'Hometown must be in format: City, ST'
    }

    if (!bio || bio.length < 50 || bio.length > 300) {
      errors.bio = 'Bio must be between 50 and 300 characters'
    }

    const description = formData.get('description') as string
    if (description && description.length > 1500) {
      errors.description = 'Description cannot exceed 1500 characters'
    }

    if (!contactName || contactName.trim().length < 2) {
      errors.contactName = 'Contact name is required'
    }

    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      errors.contactEmail = 'Valid email address is required'
    }

    if (!primaryGenre) {
      errors.primaryGenre = 'Primary genre is required'
    }

    if (agreeToTerms !== 'true') {
      errors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    // File validation
    const bandPhoto = formData.get('bandPhoto') as File | null
    if (bandPhoto && bandPhoto.size > 0) {
      if (bandPhoto.size > 5242880) { // 5MB
        errors.bandPhoto = 'Photo must be less than 5MB'
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(bandPhoto.type)) {
        errors.bandPhoto = 'Photo must be JPG, PNG, or WEBP'
      }
    }

    const musicFile = formData.get('musicFile') as File | null
    if (musicFile && musicFile.size > 0) {
      if (musicFile.size > 26214400) { // 25MB
        errors.musicFile = 'Music file must be less than 25MB'
      }
      if (!['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav'].includes(musicFile.type)) {
        errors.musicFile = 'Music file must be MP3 or WAV'
      }
    }

    return errors
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPhotoPreview(null)
    }
  }

  const handleMusicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMusicFileName(file.name)
    } else {
      setMusicFileName(null)
    }
  }

  const handleAdditionalGenresChange = (genre: string, checked: boolean) => {
    if (checked) {
      if (selectedAdditionalGenres.length < 2) {
        setSelectedAdditionalGenres([...selectedAdditionalGenres, genre])
      }
    } else {
      setSelectedAdditionalGenres(selectedAdditionalGenres.filter(g => g !== genre))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrors({})

    const formData = new FormData(e.currentTarget)

    // Add additional genres as JSON
    formData.set('additionalGenres', JSON.stringify(selectedAdditionalGenres))

    // Validate
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      setSubmitStatus({ type: 'error', message: 'Please fix the errors below' })
      return
    }

    try {
      const result = await submitMusicSubmission(formData)

      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message || 'Submission successful!' })
        formRef.current?.reset()
        setPhotoPreview(null)
        setMusicFileName(null)
        setSelectedAdditionalGenres([])
        setBioLength(0)
        setDescriptionLength(0)
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Submission failed' })
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'An unexpected error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Status Messages */}
      {submitStatus && (
        <div
          className={`p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Section 1: Band Information */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 text-gray-900">Band Information</h2>

        {/* Band Name */}
        <div>
          <label htmlFor="bandName" className="block text-sm font-medium mb-1 text-gray-900">
            Band Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="bandName"
            name="bandName"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="Enter your band name"
          />
          {errors.bandName && <p className="text-red-500 text-sm mt-1">{errors.bandName}</p>}
          <p className="text-gray-500 text-sm mt-1">This will appear on your public profile</p>
        </div>

        {/* Hometown */}
        <div>
          <label htmlFor="hometown" className="block text-sm font-medium mb-1 text-gray-900">
            Hometown/Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="hometown"
            name="hometown"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="Salt Lake City, UT"
            pattern="[\w\s]+,\s*[A-Za-z]{2}"
          />
          {errors.hometown && <p className="text-red-500 text-sm mt-1">{errors.hometown}</p>}
          <p className="text-gray-500 text-sm mt-1">Format: City, ST</p>
        </div>

        {/* Short Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1 text-gray-900">
            Short Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            required
            rows={3}
            maxLength={300}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="One-liner that captures your sound"
            onChange={(e) => setBioLength(e.target.value.length)}
          />
          <div className="flex justify-between text-sm mt-1">
            <p className="text-gray-500">One-liner that captures your sound (appears in listings)</p>
            <p className={`${bioLength < 50 ? 'text-red-500' : bioLength > 300 ? 'text-red-500' : 'text-gray-500'}`}>
              {bioLength}/300 (min 50)
            </p>
          </div>
          {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
        </div>

        {/* Full Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-900">
            Full Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={8}
            maxLength={1500}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="Tell us your story, influences, and what makes your music unique"
            onChange={(e) => setDescriptionLength(e.target.value.length)}
          />
          <div className="flex justify-between text-sm mt-1">
            <p className="text-gray-500">Tell us your story, influences, and what makes your music unique</p>
            <p className="text-gray-500">{descriptionLength}/1500</p>
          </div>
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Band Photo */}
        <div>
          <label htmlFor="bandPhoto" className="block text-sm font-medium mb-1 text-gray-900">
            Band Photo <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="file"
            id="bandPhoto"
            name="bandPhoto"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            onChange={handlePhotoChange}
          />
          {errors.bandPhoto && <p className="text-red-500 text-sm mt-1">{errors.bandPhoto}</p>}
          <p className="text-gray-500 text-sm mt-1">JPG, PNG, or WEBP (max 5MB, landscape orientation works best)</p>
          {photoPreview && (
            <div className="mt-2">
              <img src={photoPreview} alt="Preview" className="max-w-xs rounded-lg shadow" />
            </div>
          )}
        </div>
      </section>

      {/* Section 2: Your Music */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 text-gray-900">Your Music</h2>

        {/* Music Upload */}
        <div>
          <label htmlFor="musicFile" className="block text-sm font-medium mb-1 text-gray-900">
            Music Upload <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="file"
            id="musicFile"
            name="musicFile"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            onChange={handleMusicChange}
          />
          {errors.musicFile && <p className="text-red-500 text-sm mt-1">{errors.musicFile}</p>}
          <p className="text-gray-500 text-sm mt-1">MP3 or WAV (max 25MB, 320kbps+ recommended)</p>
          {musicFileName && (
            <p className="text-green-600 text-sm mt-1">Selected: {musicFileName}</p>
          )}
        </div>

        {/* Song Title */}
        <div>
          <label htmlFor="songTitle" className="block text-sm font-medium mb-1 text-gray-900">
            Song Title <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="songTitle"
            name="songTitle"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="Title of the uploaded track"
          />
        </div>

        {/* Song Description */}
        <div>
          <label htmlFor="songDescription" className="block text-sm font-medium mb-1 text-gray-900">
            Song Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="songDescription"
            name="songDescription"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="What's the story behind this song?"
          />
        </div>

        {/* Streaming Links */}
        <div>
          <label htmlFor="streamingLinks" className="block text-sm font-medium mb-1 text-gray-900">
            Streaming/Download Links <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="streamingLinks"
            name="streamingLinks"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="Spotify, Bandcamp, SoundCloud URLs (comma separated, max 3)"
          />
          <p className="text-gray-500 text-sm mt-1">Separate multiple links with commas</p>
        </div>
      </section>

      {/* Section 3: Genre & Style */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 text-gray-900">Genre & Style</h2>

        {/* Primary Genre */}
        <div>
          <label htmlFor="primaryGenre" className="block text-sm font-medium mb-1 text-gray-900">
            Primary Genre <span className="text-red-500">*</span>
          </label>
          <select
            id="primaryGenre"
            name="primaryGenre"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          >
            <option value="">Select a genre</option>
            {GENRE_OPTIONS.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          {errors.primaryGenre && <p className="text-red-500 text-sm mt-1">{errors.primaryGenre}</p>}
        </div>

        {/* Additional Genres */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">
            Additional Genres <span className="text-gray-400">(optional, max 2)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {GENRE_OPTIONS.map(genre => (
              <label key={genre} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedAdditionalGenres.includes(genre)}
                  onChange={(e) => handleAdditionalGenresChange(genre, e.target.checked)}
                  disabled={!selectedAdditionalGenres.includes(genre) && selectedAdditionalGenres.length >= 2}
                  className="rounded"
                />
                <span className="text-sm text-gray-900">{genre}</span>
              </label>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-1">Selected: {selectedAdditionalGenres.length}/2</p>
        </div>

        {/* For Fans Of */}
        <div>
          <label htmlFor="ffo" className="block text-sm font-medium mb-1 text-gray-900">
            &quot;For Fans Of&quot; (FFO) <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            id="ffo"
            name="ffo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="e.g., The National Parks, Red Bennies"
          />
          <p className="text-gray-500 text-sm mt-1">List 2-3 similar artists</p>
        </div>
      </section>

      {/* Section 4: Contact & Links */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 text-gray-900">Contact & Links</h2>

        {/* Contact Name */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium mb-1 text-gray-900">
            Primary Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="Your name"
          />
          {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium mb-1 text-gray-900">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="your@email.com"
          />
          {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
        </div>

        {/* Contact Phone */}
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium mb-1 text-gray-900">
            Contact Phone <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="555-123-4567"
          />
        </div>

        {/* Social Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1 text-gray-900">
              Band Website <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              id="website"
              name="website"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="https://yourband.com"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium mb-1 text-gray-900">
              Instagram <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              id="instagram"
              name="instagram"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="https://instagram.com/yourband"
            />
          </div>

          <div>
            <label htmlFor="facebook" className="block text-sm font-medium mb-1 text-gray-900">
              Facebook <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              id="facebook"
              name="facebook"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="https://facebook.com/yourband"
            />
          </div>

          <div>
            <label htmlFor="spotify" className="block text-sm font-medium mb-1 text-gray-900">
              Spotify <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              id="spotify"
              name="spotify"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="https://open.spotify.com/artist/..."
            />
          </div>

          <div>
            <label htmlFor="bandcamp" className="block text-sm font-medium mb-1 text-gray-900">
              Bandcamp <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              id="bandcamp"
              name="bandcamp"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="https://yourband.bandcamp.com"
            />
          </div>

          <div>
            <label htmlFor="tiktok" className="block text-sm font-medium mb-1 text-gray-900">
              TikTok <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="url"
              id="tiktok"
              name="tiktok"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="https://tiktok.com/@yourband"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Submission Details */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 text-gray-900">Submission Details</h2>

        {/* How did you hear about us */}
        <div>
          <label htmlFor="howDidYouHear" className="block text-sm font-medium mb-1 text-gray-900">
            How did you hear about us? <span className="text-gray-400">(optional)</span>
          </label>
          <select
            id="howDidYouHear"
            name="howDidYouHear"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          >
            <option value="">Select an option</option>
            {REFERRAL_SOURCE_OPTIONS.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
        </div>

        {/* Available for live shows */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">
            Available for live shows? <span className="text-gray-400">(optional)</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="bookingAvailable" value="yes" className="rounded" />
              <span className="text-gray-900">Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="bookingAvailable" value="no" className="rounded" />
              <span className="text-gray-900">No</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="bookingAvailable" value="maybe" className="rounded" />
              <span className="text-gray-900">Maybe</span>
            </label>
          </div>
        </div>

        {/* Additional Comments */}
        <div>
          <label htmlFor="additionalComments" className="block text-sm font-medium mb-1 text-gray-900">
            Additional Comments <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="additionalComments"
            name="additionalComments"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            placeholder="Anything else we should know?"
          />
        </div>
      </section>

      {/* Section 6: Consent & Confirmation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 text-gray-900">Consent & Confirmation</h2>

        {/* Terms Agreement */}
        <div>
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="agreeToTerms"
              value="true"
              required
              className="mt-1 rounded"
            />
            <span className="text-sm text-gray-900">
              I confirm that I own the rights to this music or have permission to submit it. I agree to RockSalt.com&apos;s{' '}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Use</a> and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.{' '}
              <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.agreeToTerms && <p className="text-red-500 text-sm ml-6">{errors.agreeToTerms}</p>}
        </div>

        {/* Email Opt-in */}
        <div>
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="emailOptIn"
              value="true"
              className="mt-1 rounded"
            />
            <span className="text-sm text-gray-900">
              Send me updates about local shows, features, and music news from RockSalt
            </span>
          </label>
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Your Music'}
        </button>
      </div>
    </form>
  )
}
