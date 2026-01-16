import rateLimit from 'express-rate-limit';

// Created a limiter for Password Reset emails
export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 3, // Limit to 3 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    
    keyGenerator: (req, res) => {

        if (req.headers["x-forwarded-for"]) {
            return req.headers["x-forwarded-for"].split(",")[0].trim();
        }
        // Fallback to internal IP if header is missing 
        return req.ip;
    },
    
    handler: (req, res) => {
        console.log(`Rate Limit Blocked: ${req.headers["x-forwarded-for"] || req.ip}`);
        
        res.status(429).json({
            status: "fail",
            message: "Too many password reset attempts. Please verify your email or try again in 15 minutes."
        });
    }
});

// Created a limiter for Login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: "Too many login attempts. Please try again later."
  }
});