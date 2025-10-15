'use client'

import { useState, useEffect } from 'react'
import { submitEvent } from '@/app/events/actions'
import { ATTENDANCE_OPTIONS } from '@/types/eventSubmission'
import { createClient } from '@/lib/supabase/client'

type Venue = {
  id: string
  name: string
  city: string | null
  state: string | null
}

type Band = {
  id: string
  name: string
}

export default function EventSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const [venues, setVenues] = useState<Venue[]>([])
  const [bands, setBands] = useState<Band[]>([])
  const [selectedVenue, setSelectedVenue] = useState<string>('')
  const [customVenue, setCustomVenue] = useState(false)
  const [selectedBands, setSelectedBands] = useState<string[]>([])
  const [flyerFile, setFlyerFile] = useState<File | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      // Fetch venues
      const { data: venuesData } = await supabase
        .from('venues')
        .select('id, name, city, state')
        .order('name', { ascending: true })

      if (venuesData) setVenues(venuesData)

      // Fetch bands
      const { data: bandsData } = await supabase
        .from('bands')
        .select('id, name')
        .order('name', { ascending: true })

      if (bandsData) setBands(bandsData)
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    const formData = new FormData(e.currentTarget)

    const result = await submitEvent(formData)

    if (result.success) {
      setSubmitStatus({ type: 'success', message: result.message || 'Event submitted successfully!' })
      e.currentTarget.reset()
    } else {
      setSubmitStatus({ type: 'error', message: result.error || 'Failed to submit event' })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Event Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Event Information</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-900 mb-1">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Summer Music Festival 2025"
            />
          </div>

          <div>
            <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-900 mb-1">
              Event Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Describe your event, what makes it special, who&apos;s performing..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-900 mb-1">
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="startTime"
                name="startTime"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-900 mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                id="endTime"
                name="endTime"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Venue Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Venue Information</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="venueSelect" className="block text-sm font-medium text-gray-900 mb-1">
              Select Venue <span className="text-red-500">*</span>
            </label>
            <select
              id="venueSelect"
              name="venueId"
              value={selectedVenue}
              onChange={(e) => {
                setSelectedVenue(e.target.value)
                setCustomVenue(e.target.value === 'custom')
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select a venue...</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} {venue.city && venue.state ? `- ${venue.city}, ${venue.state}` : ''}
                </option>
              ))}
              <option value="custom">Other (Enter Custom Venue)</option>
            </select>
          </div>

          {customVenue && (
            <>
              <div>
                <label htmlFor="venueName" className="block text-sm font-medium text-gray-900 mb-1">
                  Venue Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="venueName"
                  name="venueName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="The Urban Lounge"
                />
              </div>

              <div>
                <label htmlFor="venueAddress" className="block text-sm font-medium text-gray-900 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="venueAddress"
                  name="venueAddress"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  placeholder="241 S 500 E"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    defaultValue="Salt Lake City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-900 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    defaultValue="UT"
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bands Playing */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Bands Playing</h3>
        <p className="text-sm text-gray-600 mb-4">Select all bands performing at this event</p>

        <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
          {bands.map((band) => (
            <label key={band.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                name="bands"
                value={band.id}
                checked={selectedBands.includes(band.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBands([...selectedBands, band.id])
                  } else {
                    setSelectedBands(selectedBands.filter((id) => id !== band.id))
                  }
                }}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-900">{band.name}</span>
            </label>
          ))}
        </div>

        {selectedBands.length > 0 && (
          <div className="mt-3 text-sm text-gray-600">
            {selectedBands.length} band{selectedBands.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Organizer Contact */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Organizer Contact</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="organizerName" className="block text-sm font-medium text-gray-900 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="organizerName"
              name="organizerName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-900 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="organizerEmail"
                name="organizerEmail"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="organizerPhone" className="block text-sm font-medium text-gray-900 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="organizerPhone"
                name="organizerPhone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Details</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-900 mb-1">
                Ticket Price
              </label>
              <input
                type="text"
                id="ticketPrice"
                name="ticketPrice"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="$10, Free, $10-15, etc."
              />
              <p className="text-xs text-gray-500 mt-1">Enter price as text (e.g., "$10", "Free", "$10-15")</p>
            </div>

            <div>
              <label htmlFor="ticketUrl" className="block text-sm font-medium text-gray-900 mb-1">
                Ticket URL
              </label>
              <input
                type="url"
                id="ticketUrl"
                name="ticketUrl"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="https://tickets.example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="flyer" className="block text-sm font-medium text-gray-900 mb-1">
              Event Flyer (JPG, PNG, or PDF)
            </label>
            <input
              type="file"
              id="flyer"
              name="flyer"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  if (file.size > 10485760) {
                    alert('File size must be less than 10MB')
                    e.target.value = ''
                    setFlyerFile(null)
                  } else {
                    setFlyerFile(file)
                  }
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
            {flyerFile && (
              <p className="text-sm text-green-600 mt-1">Selected: {flyerFile.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="eventUrl" className="block text-sm font-medium text-gray-900 mb-1">
              Event Website/Page
            </label>
            <input
              type="url"
              id="eventUrl"
              name="eventUrl"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="https://event.example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-900 mb-1">
                Facebook Event Link
              </label>
              <input
                type="url"
                id="facebook"
                name="facebook"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="https://facebook.com/events/..."
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-900 mb-1">
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="@yourevent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="expectedAttendance" className="block text-sm font-medium text-gray-900 mb-1">
              Expected Attendance
            </label>
            <select
              id="expectedAttendance"
              name="expectedAttendance"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
            >
              <option value="">Select expected attendance</option>
              {ATTENDANCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-900 mb-1">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Anything else we should know about your event?"
            />
          </div>
        </div>
      </div>

      {/* Consent */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            required
            className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-900">
            I confirm that the information provided is accurate and I have the authority to submit this event. I understand that The Rock Salt will review this submission and may contact me for additional information.
          </label>
        </div>
      </div>

      {/* Submit Status */}
      {submitStatus.type && (
        <div className={`p-4 rounded-lg ${
          submitStatus.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Event'}
        </button>
      </div>
    </form>
  )
}
