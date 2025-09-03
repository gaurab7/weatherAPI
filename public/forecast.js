
const forecastdata = JSON.parse(localStorage.getItem('forecastdata')) || null

localStorage.setItem('forecastdataCache', JSON.stringify(forecastdata))//for soft cache if user searches for same city within 10 minutes
//didnt do it for weather-->current weather keeps changing so no point in caching at all
//if user keeps req current weather for sem city multiple times immediately, there is ratelimiter
//but if its for forecast, we do still fetch the weather, but this helps me learn soft cahcing

document.addEventListener('DOMContentLoaded', ()=>{
    const forecastSec = document.getElementById('forecast-section')
    const detailedCard = document.getElementById('detailed-card')
    const astro = document.getElementById('astro-card')
    const hourlyChart = document.getElementById('hourly')
    const tDetailedCard = document.getElementById('t-detailed-card')
    const tAstro = document.getElementById('t-astro-card')
    const tHourlyChart = document.getElementById('t-hourly')
    const DDetailedCard = document.getElementById('d-detailed-card')
    const DAstro = document.getElementById('d-astro-card')
    const DHourlyChart = document.getElementById('d-hourly')
    //clearing previous info if any--causes errors if not done
    detailedCard.innerHTML = ''
    tDetailedCard.innerHTML= ''
    DDetailedCard.innerHTML= ''
    astro.innerHTML = ''
    tAstro.innerHTML = ''
    DAstro.innerHTML = ''
    hourlyChart.innerHTML = ''
    tHourlyChart.innerHTML = ''
    DHourlyChart.innerHTML = ''
    console.log(forecastdata)
    let days = []
    let todayData = []

    //the object forecastdata has many elements
    //all of them are current weather for today except one element 'forecast' which is the forecast for three days
    Object.entries(forecastdata).forEach(element => {
        todayData.push(element)
    })

    //forecast array has three elements [0,1,2]-->forecast for each day 
    //the forecastdata object is like this:
    // forecastdat{ cloud,condition, iconLink, feelslike,....forecast: { forecastday: {0: {}, 1:{}, 2:{}}}}
    //its an object i have formatted in client js and stored locally
    forecastdata.forecast.forecastday.forEach(element =>{
        days.push(element)
    })
    console.log(days)
    
    //#region today
    //today-->current weather only
    document.getElementById('dateToday').innerText = `${days[0].date}`
    detailedCard.innerHTML = `
     <li><strong><label><i class="bi bi-umbrella-fill" style="font-size:24px; color: #4A90E2;" title="Condition"></i></label></strong> 
     <img src="${forecastdata.iconLink}" style="width:30px; height:30px; vertical-align: middle; padding-bottom:0;margin:0;">
     <p style="padding:0; font-size:0.7rem;">${forecastdata.condition}</p>
     </li>
       <li><strong><label><i class="bi bi-thermometer-sun" title="Temperature" alt="Condition" style="font-size:24px; color:#424242;"></i></label></strong> ${forecastdata.temp_c}°C</li>
       <li><strong><label><img src="/assets/feelslike.jpg" title="Feelslike" alt="Feelslike" style="width:30px; height:30px;"></label></strong> ${forecastdata.feelslike}</li>
       <li><strong><label><i class="bi bi-droplet-half" title="Humidity" style="font-size:24px; color:#29B6F6;"></i></label></strong> ${forecastdata.humidity}%</li>
       <li><strong><label><i class="bi bi-clouds-fill" title="Cloud Coverage" style="font-size:24px; color:#AAB8C0;"></i></label></strong> ${forecastdata.cloud}%</li>
    `
    //todat--> hourly forecast + other forecast info for today
    detailedCard.innerHTML += `
         <li><strong><label><i class="bi bi-thermometer-high" title="Max. Temp"  style="font-size:24px; color:#FF6B6B;"></i></label></strong> ${days[0].day.maxtemp_c}°C</li>
        <li><strong><label><i class="bi bi-thermometer-half" title="Avg. Temp" style="font-size:24px; color:#616161;"></i></label></strong> ${days[0].day.avgtemp_c}°C</li>
         <li><strong><label><i class="bi bi-thermometer-low" title="Min. Temp" style="font-size:24px; color:#4ABDAC;"></i></label></strong> ${days[0].day.mintemp_c}°C</li>
         <li><strong><label><i class="bi bi-cloud-rain-fill" title="Chance of Rain" style="font-size:24px; color:#29B6F6; "></i></label></strong> ${days[0].day.daily_chance_of_rain}%</li>
         <li><strong><label><i class="bi bi-snow" title="Chance of Snow" style="font-size:24px; color:#81D4FA; "></i></label></strong> ${days[0].day.daily_chance_of_snow}%</li>
         <li><strong><label><img src="/assets/uv.png" title="UV Index" alt="UV Index" style="width:30px; height:30px;"></label></strong> ${days[0].day.uv}</li>
         <li><strong><label><img src="/assets/wind-vane.png"  title="Wind Direction" alt="UV Index" style="width:30px; height:30px;"></label></strong> ${forecastdata.wind_dir}</li>
         <li><strong><label><img src="/assets/windy.png" title="Wind Speed" style="width:30px; height:30px;"></label></strong> ${forecastdata.wind_kph} kph</li>
         <li><strong><label>Max Wind: </label></strong> ${days[0].day.maxwind_kph} kph</li>
    `
    // Astro info
    astro.innerHTML = `
      <li><strong><label><img src="/assets/sunrise.png" alt="Sunrise" style="width:30px; height:30px;border:none;"></label></strong> ${days[0].astro.sunrise}</li>
      <li><strong><label><img src="/assets/sea.png" alt="Sunset" style="width:30px; height:30px;"></label></strong> ${days[0].astro.sunset}</li>
      <li><strong><label><img src="/assets/moon.png" alt="Sunrise" style="width:30px; height:30px;"></i></label></strong> ${days[0].astro.moonrise}</li>
      <li><strong><label><img src="/assets/sky.png" alt="Sunrise" style="width:30px; height:30px;"></label></strong> ${days[0].astro.moonset}</li>
      <li><strong><label>Moon Phase: </label></strong> ${days[0].astro.moon_phase}</li>
      <li><strong><label>Moon Illumination: </label></strong> ${days[0].astro.moon_illumination}%</li>
      <li><strong><label>Sun Up: </label></strong> ${days[0].astro.is_sun_up ? 'Yes' : 'No'}</li>
      <li><strong><label>Moon Up: </label></strong> ${days[0].astro.is_moon_up ? 'Yes' : 'No'}</li>
    `


    //creating a chart
    makeChart(hourlyChart.id ,days, 0)
//#endregion today


    //#region changeView
    const day = document.getElementById('day')
    const slider = document.getElementById('day-slider')
    day.innerText = "Moist Weather Today"
    document.getElementById('today-section').classList.add('show')//on load after all content is fomatted, load today
    const sections = [
         document.getElementById('forecast-section'),
         document.getElementById('today-section'),
         document.getElementById('tommorrow-section'),
         document.getElementById('day-after-section')
    ]
    slider.addEventListener('input', ()=>{
        const sectionInd = parseInt(slider.value)
        sections.forEach((element, ind)=>{
            //element and index of sections array
            if(ind == sectionInd){
                //classlist to modify css classes of the el
                switch(ind){
                    case 0:
                        day.innerText = "3-day Moist Forecast"
                        break
                    case 1:
                        day.innerText = "Moist Weather Today"
                        document.getElementById('dateToday').style.display = 'block'
                        break
                    case 2:
                        day.innerText = "Moist Weather Tommorrow"
                        document.getElementById('dateTom').style.display = 'block'
                        break
                    case 3:
                        day.innerText = "Moist Weather Day After Tommorrow"
                        document.getElementById('dateDay').style.display = 'block'
                        break
                    default:
                        day.innerText = "No Content Senor"
                        break
                }
                element.classList.add('show')
            }
            else{
                switch(ind){
                    case 1:
                        document.getElementById('dateToday').style.display = 'none'
                        break
                    case 2:
                        document.getElementById('dateTom').style.display = 'none'
                        break
                    case 3:
                        document.getElementById('dateDay').style.display = 'none'
                        break
                }
                element.classList.remove('show')
            }
        })
    })
    //#endregion changeView

    //#region f-tommor-dayafter
    document.getElementById('dateTom').innerText = `${days[1].date}`
    document.getElementById('dateDay').innerText = `${days[2].date}`
    addContent(tDetailedCard,tAstro,tHourlyChart,days,1)//tommorrow
    addContent(DDetailedCard,DAstro,DHourlyChart,days,2)//day after tommorrow
    addContetnForecast(forecastSec, days)
    //#endregion f-tommor-dayafter

    //#region card-click
    const day1 = document.getElementById('day1')
    const day2 = document.getElementById('day2')
    const day3 = document.getElementById('day3')
    if(day1){
        day1.addEventListener('click', ()=>{
            slider.value=1
            slider.dispatchEvent(new Event("input", {bubbles: true}))//manually triggering input event of slder after updating value manually
        })
    }
    if(day2){
        day2.addEventListener('click', ()=>{
            slider.value=2
            slider.dispatchEvent(new Event("input", {bubbles: true}))//manually triggering input event of slder after updating value manually
        })
    }
    if(day3){
        day3.addEventListener('click', ()=>{
            slider.value=3
            slider.dispatchEvent(new Event("input", {bubbles: true}))//manually triggering input event of slder after updating value manually
        })
    }
    //#endregion card-click
})

const charts ={}

function makeChart(canvasid, days, ind)
{
    const ctx = document.getElementById(canvasid).getContext('2d')
     let labels 
     let feelsData
     let rainData 
     let tempData
    if (charts[canvasid]) {charts[canvasid].destroy()}
    //today-->hourly
    days[ind].hour.forEach(hourData => {
      labels = days[ind].hour.map(h => h.time.slice(11, 16))//HH:MM format
      tempData = days[ind].hour.map(h => h.temp_c)
      feelsData = days[ind].hour.map(h => h.feelslike_c)
      rainData = days[ind].hour.map(h => h.chance_of_rain)
    })
     charts[canvasid] =  new Chart(ctx, {
        type: 'line',//type of chart--bar,line.etc
        data: { //data for the chart
            labels: labels,
            datasets: [
                {
                    label: 'Temp (°C)',
                    data: tempData,
                    borderColor: 'rgba(255,99,132,1)',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    yAxisID: 'y1',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Feels Like (°C)',
                    data: feelsData,
                    borderColor: 'rgba(54,162,235,1)',
                    backgroundColor: 'rgba(54,162,235,0.2)',
                    yAxisID: 'y1',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Chance of Rain (%)',
                    data: rainData,
                    borderColor: 'rgba(75,192,192,1)',
                    backgroundColor: 'rgba(75,192,192,0.2)',
                    yAxisID: 'y2',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            stacked: false,
            scales: {
                y1: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                },
                y2: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Chance of Rain (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            plugins: {
                //for the tooltip that appears when u hover over the chart lines
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const h = days[ind].hour[context.dataIndex]
                            return `${context.dataset.label}: ${context.dataset.label.includes('Rain') ? h.chance_of_rain + '%' : h.temp_c + '°C'} | Feels Like: ${h.feelslike_c}°C | Humidity: ${h.humidity}%`
                        }
                    }
                }
            }
        }
    })
}
function addContent(detailedCard, astro, hourlyChart,days, dayCount)
{
    //previously used forecastdata which was an obj this days is an array with 3 el
    //from browser console saw what days had then extracted 
    detailedCard.innerHTML = `
     <li><strong><label><i class="bi bi-umbrella-fill" style="font-size:24px; color: #4A90E2;" title="Condition"></i></label></strong> 
     <img src="${days[dayCount].day.condition.icon}" style="width:30px; height:30px; vertical-align: middle; padding-bottom:0;margin:0;">
     <p style="padding:0; font-size:0.7rem;">${days[dayCount].day.condition.text}</p>
     </li>
     <li><strong><label><i class="bi bi-droplet-half" title="Humidity" style="font-size:24px; color:#29B6F6;"></i></label></strong> ${days[dayCount].day.avghumidity}%</li>
     <li><strong><label><i class="bi bi-thermometer-high" title="Max. Temp"  style="font-size:24px; color:#FF6B6B;"></i></label></strong> ${days[dayCount].day.maxtemp_c}°C</li>
     <li><strong><label><i class="bi bi-thermometer-half" title="Avg. Temp" style="font-size:24px; color:#616161;"></i></label></strong> ${days[dayCount].day.avgtemp_c}°C</li>
     <li><strong><label><i class="bi bi-thermometer-low" title="Min. Temp" style="font-size:24px; color:#4ABDAC;"></i></label></strong> ${days[dayCount].day.mintemp_c}°C</li>
     <li><strong><label><i class="bi bi-eye-fill" title="Avg. Visibility" style="font-size:24px; color: darkgrey;"></i></label></strong> ${days[dayCount].day.avgvis_km} km</li>
     <li><strong><label><i class="bi bi-cloud-rain-fill" title="Chance of Rain" style="font-size:24px; color:#29B6F6; "></i></label></strong> ${days[dayCount].day.daily_chance_of_rain}%</li>
     <li><strong><label><i class="bi bi-snow" title="Chance of Snow" style="font-size:24px; color:#81D4FA; "></i></label></strong> ${days[dayCount].day.daily_chance_of_snow}%</li>
     <li><strong><label><img src="/assets/uv.png" title="UV Index" alt="UV Index" style="width:30px; height:30px;"></label></strong> ${days[dayCount].day.uv}</li>
     <li><strong><label><i class="bi bi-cloud-drizzle-fill" title="Total Precipitation" style="font-size:24px; color:#29B6F6;"></i></label></strong> ${days[dayCount].day.totalprecip_mm} mm</li>
    <li><strong><label><i class="bi bi-cloud-snow-fill" title="Total Snow" style="font-size:24px; color:darkgrey; "></i></label></strong> ${days[dayCount].day.totalsnow_cm} cm</li>
     <li><strong><label>Rain?</label></strong> ${days[dayCount].day.daily_will_it_rain ? 'Yes' : 'No'} </li>
     <li><strong><label>Snow?</label></strong> ${days[dayCount].day.daily_will_it_snow ? 'Yes' : 'No'} </li>
     <li><strong><label>Max Wind: </label></strong> ${days[dayCount].day.maxwind_kph} kph</li>
    `
    // Astro info
    astro.innerHTML = `
      <li><strong><label><img src="/assets/sunrise.png" alt="Sunrise" style="width:30px; height:30px;border:none;"></label></strong> ${days[dayCount].astro.sunrise}</li>
      <li><strong><label><img src="/assets/sea.png" alt="Sunset" style="width:30px; height:30px;"></label></strong> ${days[dayCount].astro.sunset}</li>
      <li><strong><label><img src="/assets/moon.png" alt="Sunrise" style="width:30px; height:30px;"></i></label></strong> ${days[dayCount].astro.moonrise}</li>
      <li><strong><label><img src="/assets/sky.png" alt="Sunrise" style="width:30px; height:30px;"></label></strong> ${days[dayCount].astro.moonset}</li>
      <li><strong><label>Moon Phase: </label></strong> ${days[dayCount].astro.moon_phase}</li>
      <li><strong><label>Moon Illumination: </label></strong> ${days[dayCount].astro.moon_illumination}%</li>
      <li><strong><label>Sun Up: </label></strong> ${days[dayCount].astro.is_sun_up ? 'Yes' : 'No'}</li>
      <li><strong><label>Moon Up: </label></strong> ${days[dayCount].astro.is_moon_up ? 'Yes' : 'No'}</li>
    `
    makeChart(hourlyChart.id,days, dayCount)
}
function addContetnForecast(forecastSection, days){

    for(let dayCount=0;dayCount<=2;dayCount++){
      const forecastCard = document.createElement('div')
      forecastCard.setAttribute("id", `day${dayCount+1}`)
      forecastCard.classList.add('detailed-card')//so that the detailed-card style is applied

      forecastCard.innerHTML = `
      <li><strong><label><i class="bi bi-umbrella-fill" style="font-size:24px; color:#4A90E2;" title="Condition"></i></label></strong> 
        <img src="${days[dayCount].day.condition.icon}" style="width:30px; height:30px; vertical-align: middle; margin:0;">
        <p style="padding:0; font-size:0.7rem; margin:0;">${days[dayCount].day.condition.text}</p>
      </li>
      <li><strong><label><i class="bi bi-thermometer-high" title="Max. Temp" style="font-size:24px; color:#FF6B6B;"></i></label></strong> ${days[dayCount].day.maxtemp_c}°C</li>
      <li><strong><label><i class="bi bi-thermometer-low" title="Min. Temp" style="font-size:24px; color:#4ABDAC;"></i></label></strong> ${days[dayCount].day.mintemp_c}°C</li>
      <li><strong><label><i class="bi bi-droplet-half" title="Humidity" style="font-size:24px; color:#29B6F6;"></i></label></strong> ${days[dayCount].day.avghumidity}%</li>
      <li><strong><label><i class="bi bi-cloud-rain-fill" title="Chance of Rain" style="font-size:24px; color:#29B6F6;"></i></label></strong> ${days[dayCount].day.daily_chance_of_rain}%</li>
      <li><strong><label><i class="bi bi-wind" title="Max Wind" style="font-size:24px; color:grey;"></i></label></strong> ${days[dayCount].day.maxwind_kph} kph</li>
      <li><strong><label><img src="/assets/uv.png" title="UV Index" alt="UV Index" style="width:30px; height:30px;"></label></strong> ${days[dayCount].day.uv}</li>

    `
    forecastCard.style.marginBottom = '1rem'
    //forecastCard.style.display = 'flex'
    forecastCard.style.gap = '15px'

    const p = document.createElement('p')
    p.innerHTML = `<p style="text-align: center; color:#2C5D7D;"> Moist Forecast D${dayCount+1}</p>`
    forecastSection.appendChild(p)
    forecastSection.appendChild(forecastCard) 

    }
}