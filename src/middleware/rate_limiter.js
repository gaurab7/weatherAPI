import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 80, //80 requests per 10 minute-->8 per minute 
  message: 'You have reached the request limits. Please try again later',
  standardHeaders: true,//new format apparently
  legacyHeaders: false,//older one 
})