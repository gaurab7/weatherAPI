import { latLongTo3D, toggleRotation, changeViewToCoords, rain} from './globe.js'

document.addEventListener('DOMContentLoaded', ()=>{
    const cityForm = document.getElementById('city-form')
    const errorMessageDiv = document.getElementById('error-message')
    const weatherCard = document.getElementById('weather-card')
    if(cityForm){
        cityForm.addEventListener('submit', (e)=>{
            e.preventDefault()//prevents form from submitting and reloading the page

            const cityInput = document.getElementById('city-input')
            const city = cityInput.value.trim()
            if (city === '') {
                // Show the custom error message
                errorMessageDiv.style.display = 'block'
                errorMessageDiv.textContent = 'Please enter a city name.'
                return
            } else {
                // Hide the error message if input is valid
                errorMessageDiv.style.display = 'none'
                errorMessageDiv.textContent = ''
            }
            console.log('ok')
            const url = `/weather?q=${city}`
            fetch(url)
            .then(response => {
                //if res.status is not 2xx, throw error--in case of invalid city 400 error is thrown
                if(!response.ok){
                    errorMessageDiv.style.display = 'block'
                    errorMessageDiv.textContent = 'City not found. Invalid City Name.'
                    return response.json().then(errData => {
                        throw new Error(errData.msg || 'Error fetching weather data');
                    })
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                const lat = data.current_weather.latitude
                const lon = data.current_weather.longitude
                const coords = latLongTo3D(lat, lon, 1)//getting coords wrt globe
                toggleRotation(false)
                changeViewToCoords(lon, lat)
                document.getElementById('city').textContent = city
                const weatherInfo = [
                    { label:"Condition", value:`${data.current_weather.conditoion}`},
                    { label:"Temperature", value:`${data.current_weather.temp_c}`},
                    { label:"Humidity", value:`${data.current_weather.humidity}`},
                    { label:"Feelslike", value:`${data.current_weather.feelslike}`},
                    { label:"Time", value:`${data.current_weather.time}`}
                ]
                weatherInfo.forEach(item => {
                    const li = document.createElement("li")
                    li.innerHTML = `<strong>${item.label}:</strong> ${item.value}`
                    document.querySelector('.weather-info').appendChild(li)//byclassName doesnt work
                })
                weatherCard.style.display = "block"
             
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            })
        })
    }
})


