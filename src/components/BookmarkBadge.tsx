/**
 * Bookmark Badge Component
 * Visual bookmark icon/badge to reinforce "Utah's Bookmark for Music" branding
 */

interface BookmarkBadgeProps {
  variant?: 'icon' | 'text' | 'full'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function BookmarkBadge({ 
  variant = 'full', 
  size = 'md',
  className = '' 
}: BookmarkBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const BookmarkIcon = () => (
    <svg
      className={`${sizeClasses[size]} text-indigo-600 dark:text-indigo-400`}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
  )

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <BookmarkIcon />
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <span className={`${textSizes[size]} font-semibold text-indigo-600 dark:text-indigo-400 ${className}`}>
        Utah&apos;s Bookmark for Music
      </span>
    )
  }

  // Full variant (icon + text)
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <BookmarkIcon />
      <span className={`${textSizes[size]} font-semibold text-indigo-600 dark:text-indigo-400`}>
        Utah&apos;s Bookmark for Music
      </span>
    </div>
  )
}

