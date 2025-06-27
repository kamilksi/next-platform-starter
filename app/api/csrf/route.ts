import { NextRequest, NextResponse } from 'next/server';

// Simple token generation without JWT (Edge Runtime compatible)
export async function GET(request: NextRequest) {
  try {
    // Get IP address from headers (considering proxies)
    const getClientIP = (req: NextRequest) => {
      const forwarded = req.headers.get('x-forwarded-for');
      const realIp = req.headers.get('x-real-ip');
      return forwarded?.split(',')[0] || realIp || 'unknown';
    };

    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent')?.slice(0, 100) || 'unknown';
    
    // Generate simple token using Web Crypto API
    const sessionId = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const timestamp = Date.now();
    
    // Create simple token (not JWT, but secure for our use case)
    const tokenData = {
      sessionId,
      timestamp,
      userAgent,
      ip: clientIP,
      expires: timestamp + (15 * 60 * 1000) // 15 minutes
    };
    
    const token = btoa(JSON.stringify(tokenData));

    // Create a fingerprint for additional validation using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(userAgent + clientIP + sessionId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fingerprint = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);

    return NextResponse.json({
      token,
      fingerprint,
      expires: tokenData.expires
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
