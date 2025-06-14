import express from 'express'
import weatherRoutes from './routes/weatherRoute.js'
import { verificationMiddleware } from './middleware/cityVerify.js'


const app = express()

//enables app to accept and send json data
app.use(express.json())

const PORT = process.env.PORT || 8848

//ROUTES
app.use('/weather',verificationMiddleware , weatherRoutes)


//Start the server
app.listen(PORT, ()=>{
    console.log(`server started on PORT: ${PORT}`)
})

export default app