import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;


//   // If trying to access dashboard but no token → redirect
//   if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/signin', req.url));
//   }
  const publicPaths = ['/signin', '/signup', '/forgot-password', '/reset-password'];

  // If already logged in and tries to go to /signin → redirect to dashboard
  if (token && req.nextUrl.pathname.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // If the request path starts with any public path, allow it
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

// 🔒 For all other routes, require token
  if (!token) {
    const loginUrl = new URL('/signin', req.url);
    loginUrl.searchParams.set('from', pathname); // optional redirect after login
    return NextResponse.redirect(loginUrl);
  }

  

  // Continue normally
  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],

//   matcher: [
//     '/dashboard/:path*', // protect all /dashboard routes
//     '/signin',           // optional redirect logic
//   ],
};
