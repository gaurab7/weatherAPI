import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const username = process.env.geonames_user
//using async function as fe
export async function verifyCity(city) {
    try {
        //must use encodeURIComponent()--> if user types New York with this it becomes 'New%York', otherwise just New York would break the search\
         const result = await axios.get(`http://api.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=2&username=${username}`)
         //result as .data and .status, result.status gives code 200 in case of succes, but cant use this to verify as even if no city found status is success
         //result.data we get is a JSON { "totalResultsCount": 1234, "geonames": [{ city info }]} ---> geonames is an array
         //as maxRows=1 it will only provide the top result, we just need to make sure there is at least one result
         if(result.data.totalResultsCount > 0)
         {
            //console.log(result.data.geonames[0])
            return true
         }
         else{
            return false
         }
  }
    catch (err) {
    console.log("error verifying city:")
    return false
   }
}