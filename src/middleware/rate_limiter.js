import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1, //10 requests per  minute
  message: 'You have reached the request limits. Please try again later',
  standardHeaders: true,//new format apparently
  legacyHeaders: false,//older one 
})