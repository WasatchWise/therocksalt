import Container from '@/components/Container'
import Button from '@/components/Button'
import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Something went wrong during authentication. Please try again.
          </p>
          <Link href="/auth/signin">
            <Button>Back to Sign In</Button>
          </Link>
        </div>
      </div>
    </Container>
  )
}
