/**
 * UMR Partnership Component
 * Displays Utah Music Radio as our network partner
 * Used in Header, Footer, and key sections
 */

import Image from 'next/image'
import Link from 'next/link'

interface UMRPartnershipProps {
  variant?: 'badge' | 'inline' | 'footer'
  showText?: boolean
  className?: string
}

export default function UMRPartnership({ 
  variant = 'badge', 
  showText = true,
  className = '' 
}: UMRPartnershipProps) {
  const baseClasses = 'inline-flex items-center gap-2 transition-opacity hover:opacity-80'
  
  if (variant === 'footer') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          A show on
        </p>
        <Link
          href="https://www.utahmusicradio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/UMR.png"
            alt="Utah Music Radio"
            width={200}
            height={67}
            className="h-20 w-auto object-contain"
          />
        </Link>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <Link
        href="https://www.utahmusicradio.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${className}`}
      >
        <Image
          src="/UMR.png"
          alt="Utah Music Radio"
          width={150}
          height={50}
          className="h-16 w-auto object-contain"
        />
        {showText && (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Network Partner
          </span>
        )}
      </Link>
    )
  }

  // Badge variant (default)
  return (
    <Link
      href="https://www.utahmusicradio.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${className}`}
      title="The Rock Salt is a show on Utah Music Radio"
    >
      <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
        Utah Music Radio
      </span>
      <Image
        src="/UMR.png"
        alt="Utah Music Radio"
        width={80}
        height={27}
        className="h-10 w-auto object-contain"
      />
    </Link>
  )
}

