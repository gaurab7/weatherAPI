import express from 'express'
import { weatherData } from '../controllers/weatherController.js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

router.get('/', async (req, res)=>{
       const city  = req.query.q
       const apiKey = process.env.apiKey
       const formatted_data = await weatherData(city, apiKey)
       res.json({ current_weather: formatted_data})//no need to use ${} as formatted_data is an object, if u do so, it will return [object Object]
})

export default router