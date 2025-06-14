import express from 'express'
import { verifyCity } from '../services/cityServices.js'



//need to format this
export async function verificationMiddleware(req, res, next){
    const city  = req.query.q
    const verification = await verifyCity(city)
    if(!verification) {
        console.log('invalid city')
        return res.status(400).json({ msg: 'Invalid city' });
    }
    else
    {
        next()
    }
}
