import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthToken, getUser } from './lib/authStorage';

export async function middleware(request: NextRequest) {
  const token = await getAuthToken();
  const user = await getUser();
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/signup'];
  const adminRoutes = ['/admin']

  console.log(token)

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthenticated = !!token;

  // If user is authenticated and tries to access login/signup, redirect to app home (e.g., /books)
  if (isAuthenticated && isPublicRoute) {
    if (user.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/books', request.url));
  }
  

  if (isAuthenticated && user.role !== 'admin' && adminRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/books', request.url)); 
  }

  // If user is NOT authenticated and tries to access protected routes, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Otherwise, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
