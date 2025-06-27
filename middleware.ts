import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Temporarily simplified middleware to fix Edge Runtime issues
  const response = NextResponse.next();
  
  // Only basic headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*'
  ],
};
