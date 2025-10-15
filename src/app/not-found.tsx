import Link from 'next/link'
import Container from '@/components/Container'
import Button from '@/components/Button'

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-8xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It might have been removed, renamed, or it never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link href="/bands">
            <Button variant="outline" size="lg">Browse Artists</Button>
          </Link>
        </div>
      </div>
    </Container>
  )
}
