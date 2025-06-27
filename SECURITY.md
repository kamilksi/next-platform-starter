# 🔐 Security Configuration Guide

## Required Setup for Production

### 1. hCaptcha Setup

1. Go to https://www.hcaptcha.com/
2. Register and create a new site
3. Get your Site Key and Secret Key
4. Add to `.env.local`:

```bash
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-actual-site-key
HCAPTCHA_SECRET_KEY=your-actual-secret-key
```

### 2. JWT Secret

Generate a strong secret key:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add to `.env.local`:

```bash
JWT_SECRET=your-generated-secret-key
```

### 3. Resend Configuration

1. Get API key from https://resend.com/
2. Verify your domain
3. Add to `.env.local`:

```bash
RESEND_API_KEY=re_xxxxx
RECIPIENT_EMAIL=your-verified-email@yourdomain.com
```

## Security Features Implemented

### ✅ Multi-layer Protection:

- **CSRF Protection** - JWT-based tokens with fingerprinting
- **Rate Limiting** - 2 requests/minute with exponential backoff
- **hCaptcha** - Human verification
- **Honeypot Fields** - Bot detection
- **Timing Analysis** - Detects too-fast submissions
- **Content Analysis** - Spam pattern detection
- **IP Geoblocking** - Block suspicious countries
- **Security Headers** - CSP, HSTS, XSS protection
- **Input Sanitization** - Clean and validate all inputs
- **User Agent Filtering** - Block bots and scrapers

### 🛡️ Security Level: 9/10

## Monitoring & Logging

All security events are logged to console. In production, consider:

- Setting up proper logging service (LogRocket, Sentry)
- Database for rate limiting (Redis)
- Real-time alerts for suspicious activity
- IP reputation checking

## Testing Security

Test your form security:

1. Try submitting too quickly ❌
2. Fill honeypot field ❌
3. Submit without CAPTCHA ❌
4. Use suspicious content ❌
5. Too many requests ❌

All should be blocked! ✅
