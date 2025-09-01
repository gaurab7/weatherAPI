const forecastdata = JSON.parse(sessionStorage.getItem('forecastdata')) || null

document.addEventListener('DOMContentLoaded', ()=>{
    console.log(forecastdata)
})