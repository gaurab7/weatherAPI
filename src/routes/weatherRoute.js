import express from 'express'
import { fetchWeather } from '../services/weatherServices.js'

const router = express.Router()

router.get('/', (req, res)=>{
       res.json(fetchWeather())
})

export default router