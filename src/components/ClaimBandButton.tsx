'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { claimBand } from '@/app/actions/claimBand'
import Button from './Button'
import { useAuth } from '@/hooks/useAuth'

interface ClaimBandButtonProps {
  bandId: string
  bandName: string
  isClaimed: boolean
}

export default function ClaimBandButton({ bandId, bandName, isClaimed }: ClaimBandButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (isClaimed || authLoading) {
    return null
  }

  const handleClaim = async () => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    setError(null)

    const result = await claimBand(bandId)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      setError(result.error || 'Failed to claim band')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-green-600 dark:text-green-400 font-medium">
          Successfully claimed {bandName}! Redirecting to dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Is this your band?
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Claim this page to manage your band's profile, upload tracks, and add photos.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <Button
        onClick={handleClaim}
        disabled={loading}
        className="w-full sm:w-auto"
      >
        {loading ? 'Claiming...' : user ? 'Claim This Page' : 'Sign In to Claim'}
      </Button>
    </div>
  )
}
