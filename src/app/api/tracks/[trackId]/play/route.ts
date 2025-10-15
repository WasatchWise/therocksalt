import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params
    const supabase = await createClient()

    // Call the RPC function to increment play count
    const { error } = await supabase.rpc('increment_track_play_count', {
      track_id: trackId
    })

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error incrementing play count:', error)
      }
      return NextResponse.json(
        { error: 'Failed to increment play count' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in play count API:', error)
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
