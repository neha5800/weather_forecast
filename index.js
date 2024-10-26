
const apiKey = '4631e1ba118978790699c0b85f4d3bcb';

// search data by city

function getWeather(city){
 
  const weatherApiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
 Promise.all([fetch(weatherApiUrl),fetch(forecastApiUrl)])
 
 
  .then(async([weatherResponse,forecastResponse])=>{
    const weatherData=await weatherResponse.json();
    const forecastData=await forecastResponse.json();
    if(weatherData.cod===200&& forecastData.cod==='200'){
      displayWeather(weatherData);
      displayForecast(forecastData);
     // addToRecentCities(city);
     // updateRecentCitiesDropdown();
    }else{
      document.getElementById("weather").innerHTML=`<p>${weatherData.message}</p>`;

    }
  })
  .catch(error=>{
    console.error( error);
    document.getElementById('weather').innerHTML = '<p>Error occurs while fetching weather data</p>';
  });
  
}

function displayWeather(weatherData){
  const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  const weatherElement=document.getElementById("weather");
  const{main,name,weather,wind}=weatherData;
  weatherElement.innerHTML=`
  <h2 class="text-2xl underline font-bold">${name}</h2>
  <div>
   <img src="${weatherIconUrl}" class="items-right">
  <p class="text-lg ">${weather[0].description}</p>
  </div>
  
   <p class="text-lg">Temperature:${main.temp}°C</p>
    <p class="text-lg">Humidity:${main.humidity}%</p>
     <p class="text-lg">Wind:${wind.speed} m/s</p>
  `;

}

// forecast data
function displayForecast(forecastData){
  
  const forecastElement=document.getElementById("forecast");
  forecastElement.innerHTML = '';
 
  let forecastHTML='<h3 class="text=xl font-semibold">5-Day Forecast:</h3>  <div class="flex flex-wrap justify-center">';
 const dailyForecasts=forecastData.list.filter(item=>item.dt_txt.includes("12:00:00"));
  dailyForecasts.forEach(day=>{
  const date=new Date (day.dt_txt).toLocaleDateString();
  const iconUrl=`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
  const description=day.weather[0].description;
  const temp=day.main.temp;
  const humidity=day.main.humidity;
  const windSpeed=day.wind.speed;
    forecastHTML+=`
    <div class="m-2 p-4 bg-blue-400 rounded-lg">
   
     <p class="font semibold">${ date}</p>
      <img src="${iconUrl}" alt="${description}" class="mx-auto my-2">
        <p>${description}</p>
      
       <p>Temp:${temp}°C</p>
       <p>Humidity:${humidity}%</p>
       <p>Wind:${windSpeed}m/s</p> 
       </div>
    `;
  
 });
forecastHTML+='</div>';
forecastElement.innerHTML=forecastHTML;


}

//curent location search
function getWeatherLocation (lat,lon){
  const apiUrl= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(apiUrl)
  .then(response=>response.json())
  .then(data=>{
    if(data.cod===200){
      displayWeather(data);

    }else{
      document.getElementById("weather").innerHTML=`<p>${data.message}</p>`;

    }
  }).catch(error=>{
    console.error(error);
    document.getElementById("weather").innerHTML='<p>Error occurs while fetching weather data</p>';

  });
}

//current location
document.getElementById("currLocation").addEventListener("click",()=>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>{
      const{latitude,longitude}=position.coords;
      getWeatherLocation(latitude,longitude);
    },(error)=>{
     if(error.code===error.PERMISSION_DENIED){
      handleError('Location access denied.');
     }
    });
    }else{
handleError('unable to retrive the location');
    }
  
});
//recent cities eventlistner
document.getElementById("recentSearch").addEventListener("change", (event)=>{
  const selectedCity=event.target.value;
 
     getWeather(selectedCity);
 
  
});
//recent city to save in dropdown
function addToRecentCities(city){
  let recentCities=JSON.parse(localStorage.getItem('recentCities'))|| [];
  if(!recentCities.includes(city)){
    recentCities.push(city);
    if(recentCities.length>5){
      recentCities.shift();
    }
    localStorage.setItem('recentCities',JSON.stringify(recentCities));
     updateRecentCitiesDropdown();
  }

}
function updateRecentCitiesDropdown(){
  let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
  const recentCitiesDropdown=document.getElementById('recentCitiesDropdown');
  const recentSearch=document.getElementById("recentSearch");

  recentSearch.innerHTML = '<option disabled selected>Recent search</option>';
  if(recentCities.length>0){
    recentCities.forEach(city=>{
      const option=document.createElement('option');
      option.value=city;
      option.textContent=city;
      recentSearch.appendChild(option);
    });
  
  
  
    recentCitiesDropdown.classList.remove('hidden');
  }
  else{
    recentCitiesDropdown.classList.add('hidden');
  }
}

//document.getElementById('recentCitiesDropdown').addEventListener('click',()=>{
  //const recentCitiesList=document.getElementById('recentCities');
 // recentCitiesList.classList.remove('hidden');
//});


//adding event listner to search button
document.addEventListener('DOMContentLoaded',()=>{
  const weatherForm=document.getElementById("weatherForm");
weatherForm.addEventListener('submit',(event)=>{
  event.preventDefault();
  const cityInput=document.getElementById('cityInput').value.trim();
  if (validateCityInput(cityInput)) {
    getWeather(cityInput);
    addToRecentCities(cityInput);
  }
});





const currentLocationBtn= document.getElementById("currLocation");
currentLocationBtn.addEventListener("click",()=>{
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>{
      const{latitude,longitude}=position.coords;
      getWeatherLocation(latitude,longitude);
    },()=>{
      alert('cant access your location');
    });
    }else{
alert('Allow location to access current location to your system.');
    }
  
});

// const recentCitiesBtn=document.getElementById('recentCitiesDropdown');
// recentCitiesBtn.addEventListener('click',()=>{
//   document.getElementById('recentCitiesList')
//   //.classList.toggle('hidden');
// });

});


//validation of city input
function validateCityInput(city){
  const cityPattern=/^[a-zA-Z\s]+$/;
  if(!city){
    alert('enter city ');
    return false;
  }
  if(!cityPattern.test(city)){
    alert('Invalid city ')
    return false
  }
  return true;
}







// // by default showing data of London
getWeather("London");