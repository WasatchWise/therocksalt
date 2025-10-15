import { NextResponse } from 'next/server'

export async function GET() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
  ] as const

  const env: Record<string, { configured: boolean; valuePreview?: string }> = {}
  for (const key of required) {
    const value = process.env[key]
    env[key] = {
      configured: Boolean(value),
      valuePreview: value ? `${value.slice(0, 6)}…` : undefined,
    }
  }

  return NextResponse.json({ ok: true, env })
}


