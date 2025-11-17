import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Redirect affiliate link with tracking
 * GET /api/v1/affiliates/redirect?clickId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clickId = searchParams.get('clickId')

    if (!clickId) {
      return NextResponse.json(
        { error: 'clickId is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get affiliate click record
    const { data: click, error } = await supabase
      .from('affiliate_clicks')
      .select('affiliate_url')
      .eq('id', clickId)
      .single()

    if (error || !click) {
      return NextResponse.json(
        { error: 'Invalid click ID' },
        { status: 404 }
      )
    }

    // Redirect to affiliate URL
    return NextResponse.redirect(click.affiliate_url)
  } catch (error) {
    console.error('Affiliate redirect error:', error)
    return NextResponse.json(
      {
        error: 'Failed to redirect',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

