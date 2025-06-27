import { NextRequest, NextResponse } from 'next/server';

// Suspicious countries (add/remove as needed)
const BLOCKED_COUNTRIES = ['CN', 'RU', 'KP']; // China, Russia, North Korea
const SUSPICIOUS_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'wget', 'curl', 'python', 'php'
];

function getCountryFromIP(ip: string): string | null {
  // In production, use a proper geolocation service like:
  // - Cloudflare (request.geo.country)
  // - MaxMind GeoIP
  // - IPinfo.io
  return null; // Placeholder
}

function isBlockedUserAgent(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return SUSPICIOUS_USER_AGENTS.some(pattern => ua.includes(pattern));
}

function generateNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const userAgent = request.headers.get('user-agent') || '';
  const nonce = generateNonce();
  
  // Advanced security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Strict Transport Security (HSTS)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Enhanced Content Security Policy with nonce
  response.headers.set('Content-Security-Policy', 
    `default-src 'self'; ` +
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://js.hcaptcha.com; ` +
    `style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; ` +
    `img-src 'self' data: https: https://imgs.hcaptcha.com; ` +
    `font-src 'self'; ` +
    `connect-src 'self' https://api.resend.com https://hcaptcha.com https://*.hcaptcha.com; ` +
    `frame-src https://hcaptcha.com https://*.hcaptcha.com; ` +
    `object-src 'none'; ` +
    `base-uri 'self';`
  );

  // Store nonce for scripts (if needed)
  response.headers.set('X-Nonce', nonce);

  // Geographic blocking (if IP geolocation is available)
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  const country = getCountryFromIP(clientIP);
  if (country && BLOCKED_COUNTRIES.includes(country)) {
    console.log(`Blocked request from ${country} (IP: ${clientIP})`);
    return new Response('Access denied for your region', { status: 403 });
  }

  // API specific security
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Block suspicious user agents
    if (isBlockedUserAgent(userAgent)) {
      console.log(`Blocked suspicious user agent: ${userAgent.slice(0, 100)}`);
      return new Response('Access denied', { status: 403 });
    }
    
    // Require proper headers for API calls
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        return new Response('Invalid content type', { status: 400 });
      }
      
      // Check for common attack patterns in headers
      const suspiciousHeaders = ['x-forwarded-host', 'x-original-url', 'x-rewrite-url'];
      for (const header of suspiciousHeaders) {
        if (request.headers.get(header)) {
          console.log(`Suspicious header detected: ${header}`);
          return new Response('Suspicious request', { status: 400 });
        }
      }
    }

    // Rate limiting hint (log suspicious activity)
    const requestPath = request.nextUrl.pathname;
    if (requestPath === '/api/send') {
      console.log(`Email API accessed from ${clientIP} with UA: ${userAgent.slice(0, 50)}...`);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ],
};
