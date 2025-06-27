import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';

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
    
    // Generate a unique session token
    const sessionId = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    
    // Create CSRF token with embedded session info
    const csrfToken = jwt.sign(
      { 
        sessionId, 
        timestamp,
        userAgent,
        ip: clientIP
      },
      JWT_SECRET,
      { expiresIn: '15m' } // Token expires in 15 minutes
    );

    // Create a fingerprint for additional validation
    const fingerprint = crypto
      .createHash('sha256')
      .update(userAgent + clientIP + sessionId)
      .digest('hex')
      .slice(0, 16);

    return NextResponse.json({
      token: csrfToken,
      fingerprint,
      expires: timestamp + (15 * 60 * 1000) // 15 minutes from now
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
