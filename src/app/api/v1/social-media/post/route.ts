import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { socialMediaClient } from '@/lib/social-media/client'
import type { SocialMediaPost } from '@/lib/social-media/client'

/**
 * Post to social media
 * POST /api/v1/social-media/post
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if admin
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

    const body = await request.json()
    const post: SocialMediaPost = body

    if (!post.text || !post.platform) {
      return NextResponse.json(
        { error: 'text and platform are required' },
        { status: 400 }
      )
    }

    // Post to social media
    const results = await socialMediaClient.postToAll(post)

    // Store post in database for tracking
    await supabase.from('social_posts').insert({
      user_id: user.id,
      platform: post.platform,
      text: post.text,
      image_url: post.imageUrl,
      link: post.link,
      status: 'posted',
      posted_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error('Social media post error:', error)
    return NextResponse.json(
      {
        error: 'Failed to post to social media',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

