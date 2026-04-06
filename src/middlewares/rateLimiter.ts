import rateLimit from 'express-rate-limit';

// General rate limiter for all APIs
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
});

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login/signup requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many authentication attempts, please try again after 15 minutes',
    },
});
