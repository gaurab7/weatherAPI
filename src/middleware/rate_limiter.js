import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, //10 requests per 10 minute
  message: 'You have reached the request limits. Please try again later',
  standardHeaders: true,//new format apparently
  legacyHeaders: false,//older one 
})