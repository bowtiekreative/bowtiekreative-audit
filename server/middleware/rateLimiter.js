import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for update code verification endpoint
 * Prevents brute force attacks on update codes
 * 
 * Limits: 5 attempts per 15 minutes per IP
 */
export const verifyCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many verification attempts. Please try again in 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests (only count failed verifications)
  skipSuccessfulRequests: true,
  // Custom key generator to use IP address
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip} on verify-code endpoint`);
    res.status(429).json({
      success: false,
      message: 'Too many verification attempts from this IP. Please try again in 15 minutes.',
      retryAfter: 900 // seconds
    });
  }
});

/**
 * Rate limiter for audit update endpoint
 * Prevents abuse of the update functionality
 * 
 * Limits: 3 updates per hour per IP
 */
export const updateAuditLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 update requests per windowMs
  message: {
    success: false,
    message: 'Too many update attempts. Please try again in 1 hour.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all update attempts
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip} on update endpoint`);
    res.status(429).json({
      success: false,
      message: 'Too many update attempts from this IP. Please try again in 1 hour.',
      retryAfter: 3600 // seconds
    });
  }
});

/**
 * General rate limiter for audit creation
 * Prevents spam audit submissions
 * 
 * Limits: 3 audits per hour per IP
 */
export const createAuditLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 audit creations per windowMs
  message: {
    success: false,
    message: 'Too many audit submissions. Please try again in 1 hour.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit exceeded for IP: ${req.ip} on create audit endpoint`);
    res.status(429).json({
      success: false,
      message: 'Too many audit submissions from this IP. Please try again in 1 hour.',
      retryAfter: 3600 // seconds
    });
  }
});
