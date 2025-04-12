
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access')?.value;

  const protectedPaths = ['/fastplan'];
  const pathname = request.nextUrl.pathname;

  if (protectedPaths.includes(pathname)) {
    if (!token) {
      const url = new URL('/signin', request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/fastplan'],
};
