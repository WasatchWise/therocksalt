import { redirect } from 'next/navigation'
import { getSpiderRider } from '@/lib/supabase/spider-rider-queries'
import SpiderRiderForm from '@/components/SpiderRiderForm'
import Container from '@/components/Container'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tour Spider Rider',
  description: 'Create your touring contract and get booked by qualified venues and event organizers.',
}

export const dynamic = 'force-dynamic'

export default async function SpiderRiderPage() {
  // TODO: Get actual band_id from authenticated user
  // For now, we'll use a placeholder
  const bandId = 'temp-band-id' // Replace with actual auth logic

  // Fetch existing rider if one exists
  const existingRider = await getSpiderRider(bandId)

  return (
    <Container className="py-12">
      <SpiderRiderForm bandId={bandId} existingRider={existingRider} />
    </Container>
  )
}
