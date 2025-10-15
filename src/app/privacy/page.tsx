import Container from '@/components/Container'

export const metadata = {
  title: 'Privacy Policy'
}

export default function PrivacyPage() {
  return (
    <Container className="py-16 prose prose-invert max-w-3xl">
      <h1>Privacy Policy</h1>
      <p>
        This is placeholder content for your Privacy Policy. Replace with your final legal copy.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect account data and submission content for the purpose of providing the service.
      </p>
      <h2>Cookies</h2>
      <p>
        We use cookies and similar technologies for authentication and analytics.
      </p>
      <h2>Contact</h2>
      <p>
        For questions about this policy, please{' '}
        <a
          href="https://github.com/wasatchwise/the-rock-salt/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          open an issue on GitHub
        </a>.
      </p>
      <p className="text-sm opacity-70">Last updated: {new Date().toISOString().slice(0, 10)}</p>
    </Container>
  )
}


