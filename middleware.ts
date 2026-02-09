import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'nadlan_admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith('/admin')) return NextResponse.next();

  // Allow login page and login API without cookie
  if (path === '/admin' || path === '/api/admin/login') {
    const cookie = request.cookies.get(ADMIN_COOKIE);
    if (path === '/admin' && cookie?.value === ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_COOKIE);
  if (cookie?.value !== ADMIN_PASSWORD) {
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
