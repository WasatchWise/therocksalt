import Link from 'next/link'
import Container from './Container'

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
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">The Rock Salt</h3>
              <p className="text-sm text-gray-400">
                Salt Lake City&apos;s premier independent music platform.
              </p>
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
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 text-center">
            <p>&copy; {currentYear} The Rock Salt. Salt Lake Music Hub.</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
