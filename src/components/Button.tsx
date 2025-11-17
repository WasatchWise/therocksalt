import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  href?: string
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  href,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-gray-500 shadow-md hover:shadow-lg',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-400 focus:ring-indigo-500 bg-transparent',
    ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-md hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-md hover:shadow-lg'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3'
  }

  const widthClass = fullWidth ? 'w-full' : ''
  const isDisabled = disabled || loading

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} aria-disabled={isDisabled}>
        {content}
      </a>
    )
  }

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {content}
    </button>
  )
}
