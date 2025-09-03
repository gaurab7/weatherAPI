import { rotationState, rotation, toggleRotation, changeViewToCoords} from './globe.js'

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
                    return response.text().then(errText=>{
                        let errMsg
                        try{
                            const errData = JSON.parse(errText)
                            errMsg = errData.msg || 'Error fetching weather data'
                        }
                        catch{
                            errMsg = errText || `ERROR: ${response.status}`
                        }

                        errorMessageDiv.style.display = 'block'
                        errorMessageDiv.textContent = errMsg
                        throw new Error(errMsg)
                    })
                }
                return response.json()
            })
            .then(data => {
                if(!data.current_weather.success){
                    //this means fetch failed-either because the city name wasnt correct or
                        errorMessageDiv.style.display = 'block'
                        console.log(data.current_weather)
                        errorMessageDiv.textContent = data.current_weather.msg
                        return
                }
                else{
                                    //clear any info that was there in case user searches another city without clearing
                document.querySelector('.weather-info').innerHTML = ""
                console.log(data)
                const lat = data.current_weather.data.latitude
                const lon = data.current_weather.data.longitude
                //storing locally
                localStorage.setItem('forecastdata',JSON.stringify(data.current_weather.data))//the only method i could find
                changeViewToCoords(lon, lat)
                document.getElementById('city').textContent = city
                const weatherInfo = [
                    { label:"Condition", value:`${data.current_weather.data.condition}`},
                    { label:"Temperature", value:`${data.current_weather.data.temp_c}`},
                    { label:"Humidity", value:`${data.current_weather.data.humidity}`},
                    { label:"Feelslike", value:`${data.current_weather.data.feelslike}`},
                    { label:"Time", value:`${data.current_weather.data.time}`},
                    { label: "Daylight Status", value: `${data.current_weather.data.is_day}`}
                ]
                weatherInfo.forEach(item => {
                    if(item.label == "Condition"){
                        const icon = data.current_weather.data.iconLink
                        const li = document.createElement("li")
                        li.innerHTML = `<strong>${item.label}:</strong> <img src="${icon}" style="width: 30%; height: 30%;"/>`
                        document.querySelector('.weather-info').appendChild(li)
                    }
                    else if(item.label == "Daylight Status"){
                            if(item.value==1){
                                const li = document.createElement("li")
                                li.innerHTML = `<strong>${item.label}:</strong> <i class="bi-sun-fill" style="color: #ffd900ff; width:30px; font-size: 30px;"></i>`
                                document.querySelector('.weather-info').appendChild(li)
                            }
                           else {
                              const li = document.createElement("li")
                              li.innerHTML = `<strong>${item.label}:</strong> <i class="bi-moon-fill" style="color: #f0e9f5ff; font-size: 30px;"></i>`
                              document.querySelector('.weather-info').appendChild(li)
                            }
                    }
                    else{
                         const li = document.createElement("li")
                         li.innerHTML = `<strong>${item.label}:</strong> ${item.value}`
                         document.querySelector('.weather-info').appendChild(li)//byclassName doesnt work
                    }

                })
                let clearEnabled = false
                setTimeout(() => {
                  clearEnabled = true
                }, 2500)//2.5s threshold-->wont trigger until 2.5 sec have passed since card appeared
                //put 1000 but wasnt enough 
                //this conditon always works because we never delete the weatercard just hide it
                //but keep it just because
                if(weatherCard){
                    weatherCard.style.display = "block"
                    weatherCard.addEventListener('click', ()=>{
                        window.location.href = "/detailedForecast.html"
                    })
                    clear.addEventListener('click', (event)=>{
                        //to prevent weatherCard's(parent div's) event being triggered when this is clicked
                        event.stopPropagation()
                        if(!clearEnabled) return//ignore immediate clicks
                        //so theres a bug where the rotation doesnt resume if clear is clicked immeditely
                        //so we set a delay so that it cant be clicked immediately
                        weatherCard.style.display = "none"//so that the card also disappears
                        document.querySelector('.weather-info').innerHTML = '' //clearing the info on the card 
                        toggleRotation(true)//continue rotation if cleared  
                    })
                    
                }
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

    document.querySelectorAll('.faq-list dt').forEach(dt => {
    dt.addEventListener('click', () => {
        dt.classList.toggle('active')//toggle class active
        const dd = dt.nextElementSibling//next sibling is dd tag elment
        if(dd.style.display === 'block'){
            dd.style.display = 'none'//hide if it was shown
        } else {
            dd.style.display = 'block'//show if it was hidden
        }
    });
});
    
})

