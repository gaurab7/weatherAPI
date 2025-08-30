import axios from 'axios'



//using async function as fe
export async function fetchWeather(city, apiKey) {
    try {
        const weather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`)
        return weather
        
  }
   catch (err) {
    //do not print the actual error as it may contain sensitive information(api key in this case)
    console.log("error getting data")
   }
}

