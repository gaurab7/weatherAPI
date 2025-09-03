import express from 'express'
import weatherRoutes from './routes/weatherRoute.js'
import publicRoutes from './routes/publicRoutes.js'
import { verificationMiddleware } from './middleware/cityVerify.js'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import { limiter } from './middleware/rate_limiter.js'

//to get __dirname in ES6 module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//Initialize express app
const app = express()

//CORS setup
app.use(cors())

//enables app to accept and send json data
app.use(express.json())
app.set("trust proxy", 1)

app.use(express.static(path.join(__dirname,'../public')))
app.use('/assets', express.static(path.join(__dirname,'../public/assets')))


const PORT = process.env.PORT || 8848

app.use(limiter)

//ROUTES
app.use('/', publicRoutes)
app.use('/weather',verificationMiddleware , weatherRoutes)


//Start the server
app.listen(PORT, ()=>{
    console.log(`server started on PORT: ${PORT}`)
})

export default app