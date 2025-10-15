'use client'

import { useEffect } from 'react'
import Container from '@/components/Container'
import Button from '@/components/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    if (process.env.NODE_ENV === 'development') {
      console.error(error)
    }
    // TODO: Add production error reporting (e.g., Sentry)
  }, [error])

  return (
    <Container className="py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Oops!
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Something went wrong
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          We encountered an unexpected error. Don&apos;t worry, our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={reset}>
            Try Again
          </Button>
          <Button variant="outline" size="lg" href="/">
            Go Home
          </Button>
        </div>
      </div>
    </Container>
  )
}
