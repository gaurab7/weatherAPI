import axios from 'axios'



//using async function as fe
export async function fetchWeather(city, apiKey) {
    try {
        const weather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`)
        console.log(weather)
        const current_temp = weather
        return current_temp
        
  }
   catch (err) {
    console.log("error getting data:",err)
   }
}

