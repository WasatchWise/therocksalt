import Link from 'next/link'
import Container from './Container'
import UMRPartnership from './UMRPartnership'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto border-t-4 border-emerald-600 shadow-xl mb-24">
      <Container>
        <div className="py-8">
          {/* Single compact row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-gray-400">
                &copy; {currentYear} The Rock Salt · Salt Lake&apos;s Music Hub
              </p>
              <div className="flex items-center gap-4">
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <a
                  href="https://discord.gg/2kA7ctt5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Discord
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">A show on</span>
              <UMRPartnership variant="inline" />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
