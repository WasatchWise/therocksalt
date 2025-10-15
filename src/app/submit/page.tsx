import MusicSubmissionForm from '@/components/MusicSubmissionForm'
import Container from '@/components/Container'

export const metadata = {
  title: 'Submit Your Music | The Rock Salt',
  description: 'Submit your band to The Rock Salt - Utah\'s local music hub. Share your music with the community.',
}

export default function SubmitPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Music</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your music with Utah&apos;s local music community. We&apos;re always looking for new talent to feature on The Rock Salt.
          </p>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">What happens after submission?</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>We&apos;ll review your submission within 3-5 business days</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>If accepted, your band profile will be added to our directory</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>You&apos;ll receive an email with instructions to claim and customize your profile</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Get featured in our upcoming shows, playlists, and community events</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <MusicSubmissionForm />
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Questions? Email us at{' '}
            <a href="mailto:music@therocksalt.com" className="text-blue-600 hover:underline">
              music@therocksalt.com
            </a>
          </p>
        </div>
      </div>
    </Container>
  )
}
