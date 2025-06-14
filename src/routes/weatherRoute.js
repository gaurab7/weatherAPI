import express, { application } from 'express'
import { weatherData } from '../controllers/weatherController.js'
import dotenv from 'dotenv'
import { limiter  } from '../middleware/rate_limiter.js'



dotenv.config()

const router = express.Router()

//best practice to have limiters on routes rather than on server
//if city was invalid, request shouldnt count, if we put limiter middleware on server.js, it counts invalid requests as well
router.get('/', limiter,  async (req, res)=>{
       const city = req.query.q
       const formatted_data = await weatherData(city)
       res.json({ current_weather: formatted_data})//no need to use ${} as formatted_data is an object, if u do so, it will return [object Object]
})

export default router