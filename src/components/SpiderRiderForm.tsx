'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SpiderRiderData } from '@/lib/supabase/spider-rider-queries'

interface SpiderRiderFormProps {
  bandId: string
  existingRider?: any
}

export default function SpiderRiderForm({ bandId, existingRider }: SpiderRiderFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [guaranteeMin, setGuaranteeMin] = useState(existingRider?.guarantee_min ? existingRider.guarantee_min / 100 : '')
  const [guaranteeMax, setGuaranteeMax] = useState(existingRider?.guarantee_max ? existingRider.guarantee_max / 100 : '')

  const [eventTypes, setEventTypes] = useState<string[]>(
    existingRider?.available_for_event_types || ['venue_show']
  )

  const [minCapacity, setMinCapacity] = useState(existingRider?.min_venue_capacity || '')
  const [maxCapacity, setMaxCapacity] = useState(existingRider?.max_venue_capacity || '')

  const [corporateExp, setCorporateExp] = useState(existingRider?.corporate_events_experience || 0)
  const [weddingExp, setWeddingExp] = useState(existingRider?.wedding_experience || 0)
  const [hasMC, setHasMC] = useState(existingRider?.has_mc_experience || false)
  const [canLearnSongs, setCanLearnSongs] = useState(existingRider?.can_learn_specific_songs || false)

  const [ownsSound, setOwnsSound] = useState(existingRider?.owns_sound_system || false)
  const [ownsLighting, setOwnsLighting] = useState(existingRider?.owns_lighting || false)
  const [formalAttire, setFormalAttire] = useState(existingRider?.formal_attire_available || false)

  const [needsHotel, setNeedsHotel] = useState(existingRider?.lodging_requirements?.hotel || false)
  const [roomsNeeded, setRoomsNeeded] = useState(existingRider?.lodging_requirements?.rooms_needed || 1)
  const [needsGreenRoom, setNeedsGreenRoom] = useState(existingRider?.lodging_requirements?.green_room || false)

  const [minDaysNotice, setMinDaysNotice] = useState(existingRider?.min_days_notice || 30)
  const [weekdaysOnly, setWeekdaysOnly] = useState(existingRider?.routing_preferences?.weekdays_only || false)

  const [notes, setNotes] = useState(existingRider?.notes || '')

  const handleEventTypeToggle = (type: string) => {
    if (eventTypes.includes(type)) {
      setEventTypes(eventTypes.filter(t => t !== type))
    } else {
      setEventTypes([...eventTypes, type])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate minimum budget
      const minCents = Number(guaranteeMin) * 100
      if (minCents < 10000) {
        throw new Error('Minimum guarantee must be at least $100 (no exposure gigs!)')
      }

      const data: SpiderRiderData = {
        band_id: bandId,
        guarantee_min: minCents,
        guarantee_max: guaranteeMax ? Number(guaranteeMax) * 100 : undefined,
        available_for_event_types: eventTypes,
        min_venue_capacity: minCapacity ? Number(minCapacity) : undefined,
        max_venue_capacity: maxCapacity ? Number(maxCapacity) : undefined,
        corporate_events_experience: Number(corporateExp),
        wedding_experience: Number(weddingExp),
        has_mc_experience: hasMC,
        can_learn_specific_songs: canLearnSongs,
        owns_sound_system: ownsSound,
        owns_lighting: ownsLighting,
        formal_attire_available: formalAttire,
        lodging_requirements: {
          hotel: needsHotel,
          rooms_needed: Number(roomsNeeded),
          green_room: needsGreenRoom,
        },
        routing_preferences: {
          weekdays_only: weekdaysOnly,
        },
        min_days_notice: Number(minDaysNotice),
        notes,
        status: 'active',
        is_public: true,
      }

      const response = await fetch('/api/spider-rider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save Spider Rider')
      }

      // Success!
      router.push('/dashboard?spider_rider=created')
      router.refresh()
    } catch (err: any) {
      console.error('Error saving spider rider:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-8">
        <h1 className="text-3xl font-black mb-2">🕸️ Tour Spider Rider</h1>
        <p className="text-lg opacity-90">
          Post your touring terms once. Qualified venues and event organizers can request bookings instantly.
        </p>
        <p className="text-sm opacity-75 mt-2">
          ✅ No more cold-emailing hundreds of venues<br/>
          ✅ Get discovered by corporate events, weddings, and venues<br/>
          ✅ Set your terms, let the gigs come to you
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">⚠️ {error}</p>
        </div>
      )}

      {/* Section 1: Financial Terms */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">💰 Financial Terms</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          What's your guarantee range? (Minimum $100 - we don't do "exposure" gigs)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Minimum Guarantee *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={guaranteeMin}
                onChange={(e) => setGuaranteeMin(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum $100 required</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Maximum Guarantee
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                min="100"
                step="50"
                value={guaranteeMax}
                onChange={(e) => setGuaranteeMax(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="2000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Optional - leave blank if you charge a flat rate</p>
          </div>
        </div>
      </section>

      {/* Section 2: Event Types */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🎭 Event Types</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          What types of events will you play?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { value: 'venue_show', label: 'Venue Shows', desc: 'Clubs, bars, concert halls' },
            { value: 'corporate_event', label: 'Corporate Events', desc: 'Company parties, conferences' },
            { value: 'wedding', label: 'Weddings', desc: 'Ceremonies & receptions' },
            { value: 'private_party', label: 'Private Parties', desc: 'Birthdays, anniversaries' },
            { value: 'festival', label: 'Festivals', desc: 'Multi-day outdoor events' },
            { value: 'outdoor_event', label: 'Outdoor Events', desc: 'Parks, amphitheaters' },
          ].map((type) => (
            <label
              key={type.value}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                eventTypes.includes(type.value)
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={eventTypes.includes(type.value)}
                onChange={() => handleEventTypeToggle(type.value)}
                className="mt-1 w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{type.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Section 3: Venue Capacity (for venue shows) */}
      {eventTypes.includes('venue_show') && (
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🏛️ Venue Capacity</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            What size venues do you prefer to play?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Minimum Capacity
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Maximum Capacity
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="500"
              />
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Experience & Capabilities */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⭐ Experience & Capabilities</h2>

        <div className="space-y-6">
          {/* Experience counts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Corporate Events Played
              </label>
              <input
                type="number"
                min="0"
                value={corporateExp}
                onChange={(e) => setCorporateExp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Weddings Played
              </label>
              <input
                type="number"
                min="0"
                value={weddingExp}
                onChange={(e) => setWeddingExp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="0"
              />
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasMC}
                onChange={(e) => setHasMC(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">MC Experience</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Can host/announce at events (weddings, corporate)
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={canLearnSongs}
                onChange={(e) => setCanLearnSongs(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Can Learn Specific Songs</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Willing to learn requested songs (first dance, etc.)
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ownsSound}
                onChange={(e) => setOwnsSound(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Own Sound System</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Can provide PA/sound if needed
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ownsLighting}
                onChange={(e) => setOwnsLighting(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Own Lighting</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Can provide stage lighting if needed
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formalAttire}
                onChange={(e) => setFormalAttire(e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Formal Attire Available</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Have suits/tuxes for upscale events
                </div>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Section 5: Lodging & Hospitality */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🏨 Lodging & Hospitality</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          What do you need from the venue/organizer?
        </p>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={needsHotel}
              onChange={(e) => setNeedsHotel(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <div className="font-medium text-gray-900 dark:text-white">Hotel Required</div>
          </label>

          {needsHotel && (
            <div className="ml-8">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Rooms Needed
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={roomsNeeded}
                onChange={(e) => setRoomsNeeded(e.target.value)}
                className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
              />
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={needsGreenRoom}
              onChange={(e) => setNeedsGreenRoom(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <div className="font-medium text-gray-900 dark:text-white">Green Room/Private Area</div>
          </label>
        </div>
      </section>

      {/* Section 6: Routing & Scheduling */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🗺️ Routing & Scheduling</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Minimum Days Notice
            </label>
            <select
              value={minDaysNotice}
              onChange={(e) => setMinDaysNotice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
            >
              <option value="7">1 week</option>
              <option value="14">2 weeks</option>
              <option value="30">1 month</option>
              <option value="60">2 months</option>
              <option value="90">3 months</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              How far in advance do you need to be booked?
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={weekdaysOnly}
              onChange={(e) => setWeekdaysOnly(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Weekdays Only</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Only available Monday-Thursday
              </div>
            </div>
          </label>
        </div>
      </section>

      {/* Section 7: Additional Notes */}
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📝 Additional Notes</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Anything else venues/organizers should know?
        </p>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
          placeholder="e.g., We have a trailer for gear, can provide merch booth, bring our own backdrop, etc."
        />
      </section>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : existingRider ? 'Update Spider Rider' : '🕸️ Create Spider Rider'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          Cancel
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-sm text-gray-600 dark:text-gray-400">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">What happens next?</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Your Spider Rider will be visible to all event organizers on the platform</li>
          <li>Qualified venues, wedding planners, and corporate organizers can request bookings</li>
          <li>You'll get email notifications when someone wants to book you</li>
          <li>You can pause or update your rider anytime from your dashboard</li>
        </ul>
      </div>
    </form>
  )
}
