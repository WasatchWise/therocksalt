import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const hasSession = request.cookies.has('sb:token') || request.cookies.has('sb-access-token')
    if (!hasSession) {
      const loginUrl = new URL('/auth/signin', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const hasSession = request.cookies.has('sb-access-token') || request.cookies.has('sb-refresh-token')
    if (!hasSession) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}


