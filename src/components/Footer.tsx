import Link from 'next/link'
import Container from './Container'
import UMRPartnership from './UMRPartnership'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    site: [
      { name: 'Home', href: '/' },
      { name: 'Artists', href: '/bands' },
      { name: 'Venues', href: '/venues' },
      { name: 'Episodes', href: '/episodes' },
      { name: 'Events', href: '/events' },
      { name: 'Terms', href: '/terms' },
      { name: 'Privacy', href: '/privacy' },
    ],
    community: [
      { name: 'Discord', href: 'https://discord.gg/pjd27acM' },
      { name: 'About', href: '/about' },
    ]
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-white font-bold text-lg mb-2">The Rock Salt</h3>
              <p className="text-sm text-gray-400 mb-1 font-semibold">
                Salt Lake&apos;s Music Hub
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Your one-stop destination for Utah music.
              </p>
              <UMRPartnership variant="footer" />
            </div>

            {/* Site Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                {footerLinks.site.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2">
                {footerLinks.community.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <p>&copy; {currentYear} The Rock Salt. Salt Lake&apos;s Music Hub.</p>
              <p className="text-xs">
                A show on{' '}
                <a
                  href="https://www.utahmusicradio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Utah Music Radio
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
