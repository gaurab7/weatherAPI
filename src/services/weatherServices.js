import axios from 'axios'



//using async function as fe
export async function fetchWeather(city, apiKey) {
    try {
        //added days==5 to get the 5-day forecast aswell
        const weather = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5`)
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

