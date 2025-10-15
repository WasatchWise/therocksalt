import { getBands, getEpisodes, getEvents } from '@/lib/supabase/queries'

export default async function TestDbPage() {
  try {
    const [bands, episodes, events] = await Promise.all([
      getBands(5),
      getEpisodes(5),
      getEvents(5),
    ])

    return (
      <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
        <h1>Database Connectivity Test</h1>
        <section style={{ marginTop: 24 }}>
          <h2>Bands</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(bands, null, 2)}</pre>
        </section>
        <section style={{ marginTop: 24 }}>
          <h2>Episodes</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(episodes, null, 2)}</pre>
        </section>
        <section style={{ marginTop: 24 }}>
          <h2>Events</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(events, null, 2)}</pre>
        </section>
      </main>
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return (
      <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
        <h1>Database Connectivity Test</h1>
        <p style={{ color: 'tomato', marginTop: 16 }}>Error: {errorMessage}</p>
      </main>
    )
  }
}


