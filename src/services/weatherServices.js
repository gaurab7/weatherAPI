import express from 'express'
import axios from 'axios'

const city = 'Bhaktapur'//placeholder for now
const apiKey = 'fc8f372e9aa6427fb5a92510251306'

//using async function as fe
export async function fetchWeather() {
    try {
    const weather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)
    console.log(weather)
  }
   catch (err) {
    console.log("error getting data:",err)
   }
}

