import { latLongTo3D, toggleRotation, changeViewToCoords} from './globe.js'

document.addEventListener('DOMContentLoaded', ()=>{
    const cityForm = document.getElementById('city-form')
    const errorMessageDiv = document.getElementById('error-message')
    const weatherCard = document.getElementById('weather-card')
    const clear = document.getElementById('clear')
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
                    return response.json().then(errData => {
                        errorMessageDiv.style.display = 'block'
                        errorMessageDiv.textContent = `${errData.msg}`
                        throw new Error(errData.msg || 'Error fetching weather data');
                    })
                }
                return response.json()
            })
            .then(data => {
                //clear any info that was there in case user searches another city without clearing
                document.querySelector('.weather-info').innerHTML = ""
                console.log(data)
                const lat = data.current_weather.latitude
                const lon = data.current_weather.longitude
                changeViewToCoords(lon, lat)
                document.getElementById('city').textContent = city
                const weatherInfo = [
                    { label:"Condition", value:`${data.current_weather.condition}`},
                    { label:"Temperature", value:`${data.current_weather.temp_c}`},
                    { label:"Humidity", value:`${data.current_weather.humidity}`},
                    { label:"Feelslike", value:`${data.current_weather.feelslike}`},
                    { label:"Time", value:`${data.current_weather.time}`},
                    { label: "Daylight Status", value: `${data.current_weather.isDay}`}
                ]
                const date = data.current_weather.time
                const timeOfCity = date.split('')[1]//takes the second element only
                weatherInfo.forEach(item => {
                    if(item.label == "Condition"){
                        const icon = weatherIcons(item)
                        console.log(icon)
                        const li = document.createElement("li")
                        li.innerHTML = `<strong>${item.label}:</strong> <i class="${icon.iconClass}" style="color: ${icon.iconColor}"></i>`
                        document.querySelector('.weather-info').appendChild(li)
                    }
                    else if(item.label == "Daylight Status"){
                            if(item.value==1){
                                const li = document.createElement("li")
                                li.innerHTML = `<strong>${item.label}:</strong> <i class="bi-sun-fill" style="color: "#FFD700""></i>`
                                document.querySelector('.weather-info').appendChild(li)
                            }
                        else {
                          const li = document.createElement("li")
                          li.innerHTML = `<strong>${item.label}:</strong> <i class="bi-moon-fill" style="color: "indigo""></i>`
                          document.querySelector('.weather-info').appendChild(li)
                        }
                    }
                    else{
                         const li = document.createElement("li")
                         li.innerHTML = `<strong>${item.label}:</strong> ${item.value}`
                         document.querySelector('.weather-info').appendChild(li)//byclassName doesnt work
                    }

                })
                //this conditon always works because we never delete the weatercard just hide it
                //but keep it just because
                if(weatherCard){
                    weatherCard.style.display = "block"
                    clear.addEventListener('click', ()=>{
                         weatherCard.style.display = "none"//so that the card also disappears
                         document.querySelector('.weather-info').innerHTML = '' //clearing the info on the card 
                         toggleRotation(true)//continue rotation if cleared   
                    })
                    
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            })
        })
    }
    document.getElementById('share').addEventListener('click', async()=>{
        const url = location.href;
        try{
            if(navigator.share){
                await navigator.share({
                    title: document.title,
                    text: 'Moist Weather',
                    url
                })
            }
            else{
                alert('Sharing not supported')
            }
        }
        catch(err)
        {
            console.log(err.msg)
        }
    })
})


   

function weatherIcons(condition){
    const text = condition.value.toLowerCase()
    let iconClass
    let iconColor

    const timeCheck = new Date().getHours()

    //didnt know it could be done like this
    switch (true) {
        case text.includes('sunny'):
            if(timeCheck>=6 && timeCheck<=18){
                iconClass = "bi bi-sun-fill"
                iconColor = "#FFD700"
            }
            else{
                iconClass = "bi bi-moon-fill"
                iconColor =  "#ECF0F1"
            } 
            break
        case text.includes('clear'):
            if(timeCheck>=6 && timeCheck<=18){
                iconClass = "bi bi-sun-fill"
                iconColor = "#FFD700"
            }
            else{
                iconClass = "bi bi-moon-fill"
                iconColor =  "#ECF0F1"
            } 
            break
        case text.includes('partly cloudy'):
            if(timeCheck>=6 && timeCheck<=18){
                iconClass = "bi bi-cloud-sun-fill"
                iconColor = "#bdc3c7"
            }
            else{
                iconClass = "bi bi-cloud-moon-fill"
                iconColor =  "#bdc3c7"
            } 
            break
        case text.includes('cloudy'):
        case text.includes('overcast'):
            iconClass = "bi bi-clouds-fill"
            iconColor = "#bdc3c7"
            break
        case text.includes('mist'):
            iconClass = "bi bi-cloud-fog-fill"
            iconColor = "#D3D3D3"
            break          
        case text.includes('fog'):
            iconClass = "bi bi-cloud-fog-fill"
            iconColor = "#D3D3D3"
            break
        case text.includes('rain'):
            iconClass = "bi bi-cloud-rain-fill"
            iconColor = "#4e6097ff"
            break
        case text.includes('drizzle'):
            iconClass = "bi bi-cloud-drizzle-fill"
            iconColor = "#7f8c8d"
            break
        case text.includes('showers'):
            iconClass = "bi bi-cloud-rain-heavy-fill"
            iconColor = "#7f8c8d"
            break
        case text.includes('snow'):
            iconClass = "bi bi-cloud-snow-fill"
            iconColor = "#ECF0F1"
            break
        case text.includes('blizzard'):
            iconClass = "bi bi-cloud-snow-fill"
            iconColor = "#ECF0F1"
            break
        case text.includes('hail'):
            iconClass = "bi bi-cloud-hail-fill"
            iconColor = "#ECF0F1"
            break
        case text.includes('sleet'):
            iconClass = "bi bi-cloud-snow-fill"
            iconColor = "#ECF0F1"
            break
        case text.includes('thunder'):
            iconClass = "bi bi-lightning-fill"
            iconColor = "#FFD700"
            break
        case text.includes('storm'):
            iconClass = "bi bi-cloud-lightning-fill"
            iconColor = "#8a8a8a"
            break
        default:
            iconClass = "bi bi-question-circle"// A default icon
            iconColor = "white"
            break
    }

    return {iconClass, iconColor}
}