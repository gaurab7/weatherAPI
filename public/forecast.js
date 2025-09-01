const forecastdata = JSON.parse(localStorage.getItem('forecastdata')) || null

localStorage.setItem('forecastdataCache', JSON.stringify(forecastdata))//for soft cache if user searches for same city within 10 minutes
//didnt do it for weather-->current weather keeps changing so no point in caching at all
//if user keeps req current weather for sem city multiple times immediately, there is ratelimiter
//but if its for forecast, we do still fetch the weather, but this helps me learn soft cahcing

document.addEventListener('DOMContentLoaded', ()=>{
    console.log(forecastdata)
})