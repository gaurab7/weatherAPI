import express, { application } from 'express'
import dotenv from 'dotenv'
import { limiter  } from '../middleware/rate_limiter.js'
import path from 'path'
import { fileURLToPath } from 'url'

//to get __dirname in ES6 module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


dotenv.config()

const router = express.Router()

//best practice to have limiters on routes rather than on server
//if city was invalid, request shouldnt count, if we put limiter middleware on server.js, it counts invalid requests as well
router.get('/', limiter, (req, res)=>{
         res.sendFile(path.join(__dirname,'../../public/index.html'))
})

export default router
