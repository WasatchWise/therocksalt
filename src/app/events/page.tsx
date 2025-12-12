import type { Metadata } from 'next'
import EventsCalendarClient from './EventsCalendarClient'

export const metadata: Metadata = {
  title: 'December 2025 Local Show Calendar | The RockSalt',
  description: 'Local show calendar for December 2025. Find upcoming concerts, shows, and live music events across Utah.',
}

export default function EventsPage() {
  return <EventsCalendarClient />
}
