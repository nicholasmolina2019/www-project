// app/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = [
  '/dashboard',
  '/forms/account',
  '/forms/appearance',
  '/forms/display',
  '/forms/notifications',
  '/tasks',
  // Add other protected routes as needed
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // If the user is requesting a public page, allow
  if (pathname.startsWith('/authentication')) {
    return NextResponse.next()
  }

  // Check if the route is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Get token from cookies or other storage
    const token = req.cookies.get('token')?.value

    if (!token) {
      // Redirect to login page
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/authentication/login'
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/forms/:path*', '/tasks/:path*'],
}
