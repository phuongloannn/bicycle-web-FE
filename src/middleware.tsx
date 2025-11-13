import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // ✅ Các route public (không cần login)
  const publicPaths = [
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',

    // ✅ Cho phép toàn bộ store hoạt động không yêu cầu login
    '/store',
  ];

  // ✅ Nếu route bắt đầu bằng /store => cho phép vào
  if (pathname.startsWith('/store')) {
    return NextResponse.next();
  }

  // ✅ Nếu user đã login mà vào /signin → redirect về dashboard
  if (token && pathname.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // ✅ Public paths → không cần token
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // ✅ Protect /dashboard nếu chưa login
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/signin', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Protect /admin nếu chưa login
  if (!token && pathname.startsWith('/admin')) {
    const loginUrl = new URL('/signin', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ✅ Middleware chỉ chạy cho các route sau
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/signin',
    '/signup',
    '/store/:path*',
  ],
};
