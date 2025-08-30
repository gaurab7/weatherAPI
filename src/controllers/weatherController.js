import { fetchWeather } from '../services/weatherServices.js'


//need to format this
export async function weatherData(city) {
       
    const apiKey = process.env.apiKey
    const result = await fetchWeather(city, apiKey)
    //formating the fetched weather data
    //const { parent: { child } } = object;--->Extracts object.parent.child into a variable named child.
    //const { originalName: newName } = object;--->Extracts object.originalName into a variable named newName.
    const { 
        location: { localtime: lclTme,
            lat: lat,
            lon: lon
         },//result.data.location.localtime --> lclTme
        current : {
            last_updated :  lstUpd ,
            temp_c :  temp ,//result.data.current.temp_c---> temp
            is_day : is_day ,
            condition : { text : cond },
            wind_kph :  wind ,
            wind_dir :  winddir ,
            humidity :  hum ,
            cloud :   cld ,
            feelslike_c :  flike 
        } 
    } = result.data

    return {
        time : lclTme,
        last_updated :  lstUpd ,
        temp_c :  temp ,//result.data.current.temp_c---> temp
        is_day ,
        condition : cond ,
        wind_kph :  wind ,
        wind_dir :  winddir ,
        humidity :  hum ,
        cloud :   cld ,
        feelslike :  flike,
        latitude: lat,
        longitude: lon
    }
    //better than:
    /* 
    const localtime = result.data.location.localtime
    const lastUpd = result.data.current.last_updated
    const temp_c = result.data.current.temp_c
    const is_day = result.data.current.is_day
    const cond = result.data.current.condition.text
    const wind = result.data.current.windkph
    const winddir = result.data.current.wind_dir
    const hum = result.data.current.humidity
    const cld = result.data.current.cloud
    const flike = result.data.current.feelslike*/
}

