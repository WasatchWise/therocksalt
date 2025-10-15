'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [bandName, setBandName] = useState('');
  const [email, setEmail] = useState('');
  const [submissionId, setSubmissionId] = useState('');

  useEffect(() => {
    // Get params from URL (passed from submission redirect)
    setBandName(searchParams.get('band') || '');
    setEmail(searchParams.get('email') || '');
    setSubmissionId(searchParams.get('id') || '');
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            The Rock Salt
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-2">Submission Received!</h1>
          {bandName && (
            <p className="text-xl text-gray-600">
              Thanks for submitting <strong>{bandName}</strong>
            </p>
          )}
        </div>

        {/* What Happens Next */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-bold">
                1
              </span>
              <div>
                <strong className="block">We Review Your Submission</strong>
                <span className="text-gray-700">
                  Our team will carefully review your music, bio, and materials within the next{' '}
                  <strong>5-7 business days</strong>.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-bold">
                2
              </span>
              <div>
                <strong className="block">You'll Hear from Us</strong>
                <span className="text-gray-700">
                  We'll send an email to{' '}
                  <strong className="text-indigo-600">{email || 'your contact email'}</strong> with
                  our decision and next steps.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full font-bold">
                3
              </span>
              <div>
                <strong className="block">Get Featured on The Rock Salt</strong>
                <span className="text-gray-700">
                  If accepted, we'll create your band profile and share your music with the Salt
                  Lake City community!
                </span>
              </div>
            </li>
          </ol>
        </div>

        {/* Submission Details */}
        {submissionId && (
          <div className="bg-gray-50 border rounded-lg p-4 mb-8 text-center">
            <p className="text-sm text-gray-600 mb-1">Your confirmation number:</p>
            <p className="text-2xl font-mono font-bold text-gray-800">#{submissionId.slice(0, 8).toUpperCase()}</p>
            <p className="text-xs text-gray-500 mt-2">
              Save this number for your records. You can reference it if you need to contact us about
              your submission.
            </p>
          </div>
        )}

        {/* Tips While You Wait */}
        <div className="border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">While You Wait...</h3>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <span className="text-indigo-600 font-bold">→</span>
              <span>
                <strong>Check your spam folder</strong> – Make sure our emails don't get filtered
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-bold">→</span>
              <span>
                <strong>Join our Discord community</strong> – Connect with other local musicians
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-bold">→</span>
              <span>
                <strong>Follow us on Instagram</strong> – Stay updated on new features and local
                shows
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-bold">→</span>
              <span>
                <strong>Explore other local bands</strong> – Discover the Salt Lake City music scene
              </span>
            </li>
          </ul>
        </div>

        {/* Questions Section */}
        <div className="border-t pt-8">
          <h3 className="text-xl font-bold mb-4">Questions?</h3>
          <p className="text-gray-700 mb-4">
            If you have any questions about your submission or need to update information, reach out to
            us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:submit@therocksalt.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold"
            >
              Email Us
            </a>
            <Link
              href="https://discord.gg/therocksalt"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-semibold"
            >
              Join Discord
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to The Rock Salt Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function SubmissionSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
