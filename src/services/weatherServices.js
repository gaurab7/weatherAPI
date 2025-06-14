import axios from 'axios'



//using async function as fe
export async function fetchWeather(city, apiKey) {
    try {
        const weather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`)
        return weather
        
  }
   catch (err) {
    console.log("error getting data:",err)
   }
}

