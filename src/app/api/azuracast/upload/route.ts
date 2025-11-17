import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processSubmissionToPlaylist } from '@/lib/azuracast/upload'

/**
 * API Route: Upload music submission to AzuraCast
 * POST /api/azuracast/upload
 * 
 * Body: { submissionId: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!adminData) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get submission ID from request
    const body = await request.json()
    const { submissionId } = body

    if (!submissionId) {
      return NextResponse.json(
        { error: 'submissionId is required' },
        { status: 400 }
      )
    }

    // Fetch submission
    const { data: submission, error: submissionError } = await supabase
      .from('music_submissions')
      .select('*')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    if (!submission.links?.music_file) {
      return NextResponse.json(
        { error: 'Submission has no music file' },
        { status: 400 }
      )
    }

    // Upload to AzuraCast
    const apiKey = process.env.X_API_Key
    const result = await processSubmissionToPlaylist(submission, apiKey)

    // Store AzuraCast media ID in tracking table
    const { error: trackingError } = await supabase
      .from('azuracast_media')
      .upsert({
        submission_id: submissionId,
        media_id: result.mediaId,
        path: result.path,
        playlist_added: result.addedToPlaylist,
        uploaded_at: new Date().toISOString(),
      }, {
        onConflict: 'submission_id',
      })

    if (trackingError) {
      console.error('Failed to track AzuraCast media ID:', trackingError)
      // Don't fail the request - upload succeeded
    }

    return NextResponse.json({
      success: true,
      mediaId: result.mediaId,
      addedToPlaylist: result.addedToPlaylist,
      message: result.addedToPlaylist
        ? 'Track uploaded and added to playlist successfully'
        : 'Track uploaded but failed to add to playlist',
    })
  } catch (error) {
    console.error('AzuraCast upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload to AzuraCast',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

