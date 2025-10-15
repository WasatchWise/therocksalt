// Type definitions for event submission form

export interface EventSubmissionForm {
  // Event Information
  eventName: string
  eventDescription: string
  startTime: string
  endTime?: string

  // Venue Information
  venueName: string
  venueAddress?: string
  city: string
  state: string

  // Organizer Contact
  organizerName: string
  organizerEmail: string
  organizerPhone?: string

  // Links
  ticketUrl?: string
  eventUrl?: string
  facebook?: string
  instagram?: string

  // Additional
  expectedAttendance?: string
  additionalNotes?: string

  // Consent
  agreeToTerms: boolean
}

export interface EventSubmissionData {
  event_name: string
  organizer_name: string
  organizer_email: string
  organizer_phone?: string
  event_description: string
  start_time: string
  end_time?: string
  venue_id?: string
  venue_name: string
  venue_address?: string
  city: string
  state: string
  ticket_price?: string
  ticket_url?: string
  event_url?: string
  flyer_url?: string
  social_media_links?: {
    facebook?: string
    instagram?: string
  }
  expected_attendance?: string
  additional_notes?: string
  status: 'pending' | 'reviewed' | 'approved' | 'declined'
}

export const ATTENDANCE_OPTIONS = [
  'Under 50',
  '50-100',
  '100-250',
  '250-500',
  '500+',
  'Not sure'
] as const

export type ExpectedAttendance = typeof ATTENDANCE_OPTIONS[number]
