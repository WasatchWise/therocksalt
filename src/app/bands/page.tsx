import { getBands } from '@/lib/supabase/queries'
import Container from '@/components/Container'
import BandSearchFilter from '@/components/BandSearchFilter'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Artists',
  description: 'Discover talented local artists from Salt Lake City. Browse our directory of bands and musicians across all genres.',
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
          Artist Directory
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover talented local artists from the Salt Lake City music scene
        </p>
      </div>

      <BandSearchFilter bands={sortedBands} />
    </Container>
  )
}


