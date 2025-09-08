import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Log the cookies for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('API Request Path:', request.nextUrl.pathname);
    console.log('Cookies:', [...request.cookies.getAll()].map(c => `${c.name}=${c.value.substring(0, 5)}...`));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
