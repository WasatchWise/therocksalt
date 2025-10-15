import Container from '@/components/Container'
import Button from '@/components/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about The Rock Salt - Salt Lake City\'s premier independent music platform connecting local artists with the world.',
}

export default function AboutPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
          About The Rock Salt
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Salt Lake Music Hub
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The Rock Salt is Salt Lake City&apos;s premier independent music platform, dedicated to
              showcasing the vibrant and diverse talent of our local music scene. We believe that
              Salt Lake City has some of the most talented and passionate musicians in the world,
              and our mission is to give them the platform they deserve.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Through live sessions, interviews, and community engagement, we&apos;re building a bridge
              between Salt Lake&apos;s incredible artists and music lovers around the globe.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What We Do
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  🎙️ Live Sessions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Host live music performances, interviews, and conversations with local artists
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  🎸 Artist Directory
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Showcase Salt Lake City&apos;s diverse roster of talented musicians and bands
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  🎫 Event Coverage
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Keep the community informed about upcoming shows and local music events
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  💬 Community Building
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Foster connections between artists, fans, and music enthusiasts
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Whether you&apos;re a musician, music lover, or just curious about the Salt Lake City
              music scene, we&apos;d love to have you join our community. Connect with us on Discord
              to stay updated, share music, and be part of the conversation.
            </p>
            <Button href="https://discord.gg/pjd27acM" size="lg">
              Join our Discord Community
            </Button>
          </section>

          <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Get Involved
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you a local artist interested in being featured? Want to collaborate or have
              ideas to share? We&apos;re always looking to expand and improve. Reach out to us
              on Discord and let&apos;s make something amazing together.
            </p>
          </section>
        </div>
      </div>
    </Container>
  )
}
