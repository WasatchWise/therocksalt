import { getBands } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import BandSearchFilter from '@/components/BandSearchFilter'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Artists',
  description: 'Discover Utah\'s local artists and bands. Browse talented musicians across all genres from across the state and region.',
}

export default async function BandsPage() {
  const bands = await getBands(500)

  // Sort by tier (hof -> platinum -> national_act -> headliner -> garage -> anon) then by name
  const tierOrder = {
    hof: 0,
    platinum: 1,
    national_act: 2,
    headliner: 3,
    garage: 4,
    anon: 5,
    // Legacy tier support (will be migrated)
    featured: 1.5,
    free: 5
  }
  const sortedBands = [...bands].sort((a, b) => {
    const tierA = tierOrder[a.tier as keyof typeof tierOrder] ?? 5
    const tierB = tierOrder[b.tier as keyof typeof tierOrder] ?? 5
    if (tierA !== tierB) return tierA - tierB
    return (a.name || '').localeCompare(b.name || '')
  })

  return (
    <Container className="py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Utah Artists
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover talented local artists from across Utah and the region.
        </p>
      </div>

      <BandSearchFilter bands={sortedBands} />
    </Container>
  )
}


