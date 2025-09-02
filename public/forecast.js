

const forecastdata = JSON.parse(localStorage.getItem('forecastdata')) || null

localStorage.setItem('forecastdataCache', JSON.stringify(forecastdata))//for soft cache if user searches for same city within 10 minutes
//didnt do it for weather-->current weather keeps changing so no point in caching at all
//if user keeps req current weather for sem city multiple times immediately, there is ratelimiter
//but if its for forecast, we do still fetch the weather, but this helps me learn soft cahcing

document.addEventListener('DOMContentLoaded', ()=>{
    const forecastCard = document.getElementById('detailed-forecast')
    const todayCard = document.getElementById('detailed-today')
    const astro = document.getElementById('today-astro')
    const hourlyChart = document.getElementById('today-hourly')
    //clearing previous info if any
    todayCard.innerHTML = ''
    astro.innerHTML = ''
    hourlyChart.innerHTML = ''
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
    todayCard.innerHTML = `
     <li><strong><label><i class="bi bi-umbrella-fill" style="font-size:24px; color: darkgrey;" title="Condition"></i></label></strong> 
     <img src="${forecastdata.iconLink}" style="width:30px; height:30px; vertical-align: middle; padding-bottom:0;margin:0;">
     <p style="padding:0; font-size:0.7rem;">${forecastdata.condition}</p>
     </li>
       <li><strong><label><i class="bi bi-thermometer-sun" title="Temperature" alt="Condition" style="font-size:24px; color:#424242;"></i></label></strong> ${forecastdata.temp_c}°C</li>
       <li><strong><label><img src="/assets/feelslike.jpg" title="Feelslike" alt="Feelslike" style="width:30px; height:30px;"></label></strong> ${forecastdata.feelslike}</li>
       <li><strong><label><i class="bi bi-droplet-half" title="Humidity" style="font-size:24px; color:#29B6F6;"></i></label></strong> ${forecastdata.humidity}%</li>
       <li><strong><label><i class="bi bi-clouds-fill" title="Cloud Coverage" style="font-size:24px; color:#AAB8C0;"></i></label></strong> ${forecastdata.cloud}%</li>
    `
    //todat--> hourly forecast + other forecast info for today
    todayCard.innerHTML += `
         <li><strong><label><i class="bi bi-thermometer-high" title="Max. Temp"  style="font-size:24px; color:#FF7043;"></i></label></strong> ${days[0].day.maxtemp_c}°C</li>
        <li><strong><label><i class="bi bi-thermometer-half" title="Avg. Temp" style="font-size:24px; color:#616161;"></i></label></strong> ${days[0].day.avgtemp_c}°C</li>
         <li><strong><label><i class="bi bi-thermometer-low" title="Min. Temp" style="font-size:24px; color:#29B6F6;"></i></label></strong> ${days[0].day.mintemp_c}°C</li>
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
    //today-->hourly
    days[0].hour.forEach(hourData => {
     const labels = days[0].hour.map(h => h.time.slice(11, 16))//HH:MM format
     const tempData = days[0].hour.map(h => h.temp_c)
     const feelsData = days[0].hour.map(h => h.feelslike_c)
     const rainData = days[0].hour.map(h => h.chance_of_rain)
    //creating a chart
    const ctx = hourlyChart.getContext('2d')//context is a thing chartjs uses to draw on the canvas
    
    new Chart(ctx, {
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
                            const h = days[0].hour[context.dataIndex]
                            return `${context.dataset.label}: ${context.dataset.label.includes('Rain') ? h.chance_of_rain + '%' : h.temp_c + '°C'} | Feels Like: ${h.feelslike_c}°C | Humidity: ${h.humidity}%`
                        }
                    }
                }
            }
        }
    })
        })
//#endregion today

    //#region forecast
    
    //#endregion forecast

})