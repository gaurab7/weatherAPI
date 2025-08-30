document.addEventListener('DOMContentLoaded', ()=>{
    const cityForm = document.getElementById('city-form')
    const errorMessageDiv = document.getElementById('error-message');
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
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            })
        })
    }


})