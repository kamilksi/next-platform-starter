import * as React from 'react';
import { Resend } from 'resend';
import EmailTemplate from '../../estimation/components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

// Enhanced rate limiting with exponential backoff
const rateLimitMap = new Map();
const failedAttemptsMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 2; // Reduced to 2 requests per minute
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 10 * 60 * 1000; // 10 minutes lockout

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  
  // Check if IP is locked out due to failed attempts
  const failedAttempts = failedAttemptsMap.get(ip);
  if (failedAttempts && failedAttempts.count >= MAX_FAILED_ATTEMPTS) {
    if (now - failedAttempts.lastAttempt < LOCKOUT_DURATION) {
      return true; // Still locked out
    } else {
      failedAttemptsMap.delete(ip); // Reset after lockout period
    }
  }
  
  const requests = rateLimitMap.get(ip) || [];
  const validRequests = requests.filter((time: number) => now - time < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= MAX_REQUESTS) {
    recordFailedAttempt(ip);
    return true;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return false;
}

function recordFailedAttempt(ip: string) {
  const existing = failedAttemptsMap.get(ip) || { count: 0, lastAttempt: 0 };
  failedAttemptsMap.set(ip, {
    count: existing.count + 1,
    lastAttempt: Date.now()
  });
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  // Additional checks for suspicious patterns
  const suspiciousPatterns = [
    /temp/i, /disposable/i, /fake/i, /test/i, /spam/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(email));
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .slice(0, 1000); // Limit length
}

// Simple token validation without JWT (Edge Runtime compatible)
async function validateCSRFToken(token: string, fingerprint: string, request: Request): Promise<boolean> {
  try {
    const decoded = JSON.parse(atob(token));
    const now = Date.now();
    
    // Check if token is expired
    if (decoded.expires < now) {
      return false;
    }
    
    // Validate fingerprint using Web Crypto API
    const userAgent = request.headers.get('user-agent')?.slice(0, 100) || 'unknown';
    const clientIP = getClientIP(request);
    
    const encoder = new TextEncoder();
    const data = encoder.encode(userAgent + clientIP + decoded.sessionId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const expectedFingerprint = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);

    return fingerprint === expectedFingerprint;
  } catch (error) {
    console.error('CSRF validation error:', error);
    return false;
  }
}

function detectSuspiciousContent(data: any): boolean {
  const suspiciousPatterns = [
    /\b(viagra|casino|lottery|winner|congratulations)\b/i,
    /\b(click here|free money|make money)\b/i,
    /http[s]?:\/\//g, // URLs in form data
    /\b[A-Z]{10,}\b/g, // Excessive caps
  ];
  
  const textToCheck = `${data.name} ${data.description} ${data.company}`.toLowerCase();
  return suspiciousPatterns.some(pattern => pattern.test(textToCheck));
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientIp = getClientIP(request);
    if (isRateLimited(clientIp)) {
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Check for required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY');
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      description,
      projectType,
      language,
      price,
      selectedFeatures,
      featureNames,
      timestamp,
      csrfToken,
      fingerprint,
      captchaToken
    } = body;

    // CSRF Token validation
    if (!csrfToken || !fingerprint || !(await validateCSRFToken(csrfToken, fingerprint, request))) {
      recordFailedAttempt(clientIp);
      return Response.json(
        { error: 'Invalid security token' },
        { status: 403 }
      );
    }

    // Enhanced validation
    if (!name || !email || !projectType) {
      recordFailedAttempt(clientIp);
      return Response.json(
        { error: 'Name, email, and project type are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      recordFailedAttempt(clientIp);
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Timing analysis - check if form was filled too quickly
    if (timestamp) {
      const submissionTime = Date.now();
      const timeDiff = submissionTime - timestamp;
      if (timeDiff < 5000) { // Less than 5 seconds is suspicious
        recordFailedAttempt(clientIp);
        return Response.json(
          { error: 'Please take more time to fill the form' },
          { status: 400 }
        );
      }
    }

    // Content analysis for spam detection
    if (detectSuspiciousContent(body)) {
      recordFailedAttempt(clientIp);
      return Response.json(
        { error: 'Content appears to be spam' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : undefined,
      company: company ? sanitizeInput(company) : undefined,
      description: description ? sanitizeInput(description) : undefined,
      projectType: sanitizeInput(projectType),
      language: language === 'en' ? 'en' : 'pl', // Whitelist languages
      price,
      selectedFeatures,
      featureNames
    };

    // Validate price structure
    if (!price || typeof price.min !== 'number' || typeof price.max !== 'number') {
      return Response.json(
        { error: 'Invalid price data' },
        { status: 400 }
      );
    }

    // Additional security: Log the attempt for monitoring
    console.log(`Email form submission from ${clientIp} at ${new Date().toISOString()}`);

    const { data, error } = await resend.emails.send({
      from: 'Konfigurator <onboarding@resend.dev>',
      to: [process.env.RECIPIENT_EMAIL || 'delivered@resend.dev'],
      subject: `🔒 Nowe zapytanie o wycenę - ${sanitizedData.projectType} (${price.min}-${price.max} PLN)`,
      react: EmailTemplate(sanitizedData) as React.ReactElement,
      headers: {
        'X-Source': 'Contact-Form',
        'X-IP': clientIp,
        'X-Timestamp': new Date().toISOString()
      }
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json(
        { error: 'Failed to send email. Please try again.' },
        { status: 500 }
      );
    }

    return Response.json({ 
      message: 'Email sent successfully',
      // Don't expose email ID for security
    });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ 
      error: 'Internal server error. Please try again later.',
    }, { status: 500 });
  }
}