import axios from 'axios'



//using async function as fe
export async function fetchWeather(city, apiKey) {
    try {
        const weather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`)
        if(weather.data){
            return { success: true, data: weather.data}
        } 
  }
   catch (err) {
    //do not print the actual error as it may contain sensitive information(api key in this case)
    console.log("error getting data")
    return{
        success: false,
        msg: err.response?.data?.error?.message || "Unable to fetch data"
    }
   }
}

