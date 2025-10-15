import Container from '@/components/Container'

export const metadata = {
  title: 'Terms of Service'
}

export default function TermsPage() {
  return (
    <Container className="py-16 prose prose-invert max-w-3xl">
      <h1>Terms of Service</h1>
      <p>
        This is placeholder content for your Terms of Service. Replace with your final legal copy.
      </p>
      <h2>Use of Service</h2>
      <p>
        By accessing or using The Rock Salt, you agree to these terms and all applicable laws.
      </p>
      <h2>User Content</h2>
      <p>
        You are responsible for content you submit. You grant The Rock Salt a license to display and
        distribute submitted content as part of the service.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms. Continued use constitutes acceptance of the updated terms.
      </p>
      <p className="text-sm opacity-70">Last updated: {new Date().toISOString().slice(0, 10)}</p>
    </Container>
  )
}


