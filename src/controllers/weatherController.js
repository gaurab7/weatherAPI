import { fetchWeather } from '../services/weatherServices.js'
import dotenv from 'dotenv'

dotenv.config()


//need to format this
export async function weatherData(city) {
    try{            
    const apiKey = process.env.apiKey
    const result = await fetchWeather(city, apiKey)
    if(!result.success)
    {
        //this means that the city name wasnt coorect and so no data was found
        //or maybe some other fetch related error
        //i mistakenly serached guatamala instead of guatemala
        //the city verification returns true becaues even tho we searched guatamala
        // it found the best match .i.e guatemala 
        // and as we just return true or false there the weather fetch continues with guatamala which doesnt exist
        //"error":{"code":1006,"message":"No matching location found."}}
        //so an error like this is result
        const errorMsg = result.msg || "some fetching error weatherapi"
        throw new Error(errorMsg)//so we just send result with error instead
    }
    else{
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
            condition : { 
                text : cond,
                icon : iconLink
            },
            wind_kph :  wind ,
            wind_dir :  winddir ,
            humidity :  hum ,
            cloud :   cld ,
            feelslike_c :  flike,
            uv: uvInd
        },
        forecast: { forecastdays }//forecastdays is an array-->has 5 days
    } = result.data

    return {
        success: true,
        data:{
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
    
    }
    catch(error){
        console.log("Fetch failed: ", error.message)
        return {
            success: false,
            msg: error.message
        }//returns the result object-->{"error":{"code":1006,"message":"No matching location found."}}
    }

}

