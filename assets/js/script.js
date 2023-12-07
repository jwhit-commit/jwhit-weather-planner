var today = dayjs();
var cityForm = $('#citysearch');
var cityBank = $('#citybank');
var todayTitle = $('#todaytitle');
var todayTemp = $('#todaytemp');
var todayWind = $('#todaywind');
var todayHum = $('#todayhum');
var longForecast = $('#longforecast');


// API
const apiKey = "b35a434cbe848e7d5b2c5e88f013d639";

// Retrieve city list from local storage
var cities = JSON.parse(localStorage.getItem('cities'));
if (!cities) {var cities = []};


// Function to create and append a hyperlink to replace text and submit form
function createHyperlink(city) {
    var link = document.createElement('a');
    link.href = '#';
    link.textContent = city;
    
    link.addEventListener('click', function (event) {
        event.preventDefault();
        
        // Replace the value in the form field with the city
        cityForm.find('input').val(city);
        
        // Submit the form
        cityForm.submit();
    });

    return link;
}

// Function to add city to citybank
function cityDisplay(city) {
    var cityDiv = document.createElement('div');
    cityDiv.classList.add('bg-light', 'text-dark', 'p-3');
  
    var cityLink = document.createElement('a');
    cityLink.href = '#'
    cityLink.textContent = city;

    cityLink.addEventListener('click', function (event) {
        event.preventDefault();
        
        // Replace the value in the form field with the city
        cityForm.find('input').val(city);
        
        // Submit the form
        cityForm.submit();
    });

    cityDiv.append(cityLink);
    cityBank.append(cityDiv);
}

// Function to add all cities in local storage to citybank
function cityBankDisplay() {
    while (cityBank[0].firstChild) {
        cityBank[0].removeChild(cityBank[0].firstChild);
    }

    for (var i = 0; i < cities.length; i++) {
        cityDisplay(cities[i]);
      }
}

// Call previous function on page load
cityBankDisplay();


// Function to populate city list
function cityList(city) {
    cities.push(city);

    localStorage.setItem('cities', JSON.stringify(cities));

    cityBankDisplay()
}


// Function to display today's weather
async function displayToday(res) {
    temp = res.list[0].main.temp;
    wind = res.list[0].wind.speed;
    hum = res.list[0].main.humidity

    todayTitle[0].textContent = res.city.name + " " + today.format('MM/DD/YYYY');
    todayTemp[0].textContent = "Temp: " + temp + "°F";
    todayWind[0].textContent = "Wind: " + wind + " MPH";
    todayHum[0].textContent = "Temp: " + hum + " %";
}

// Function to future day forecast
function displayDay(obj) {
    console.log(obj.dt_txt.split(' ')[0])

    var dayDiv = document.createElement('div');
    dayDiv.classList.add('card','bg-light', 'text-dark', 'p-2', 'col-2', 'mx-2');

    var dayName = document.createElement('h5');
    var utcdate = dayjs.unix(obj.dt)
    dayName.innerHTML = utcdate.format('MM/DD/YYYY');

    var dayTemp = document.createElement('p');
    dayTemp.innerHTML = "Temp: " + obj.main.temp + "°F";

    var dayWind = document.createElement('p');
    dayWind.innerHTML = "Wind: " + obj.wind.speed + " MPH";

    var dayHum = document.createElement('p');
    dayHum.innerHTML = "Temp: " + obj.main.humidity + " %";

    dayDiv.append(dayName);
    dayDiv.append(dayTemp);
    dayDiv.append(dayWind);
    dayDiv.append(dayHum);
    longForecast.append(dayDiv);
}

// Event function for city search form
cityForm.on('submit', async function (event) {
    event.preventDefault();

    var cityVal = cityForm[0][0].value;

    try {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=`;
        const geoapi = url + cityVal + "&limit=5&appid=" + apiKey;

        var geoResponse = await fetch(geoapi);
        if (!geoResponse.ok) {
            throw await geoResponse.json();
        }

        var geoData = await geoResponse.json();

        const weatherapi = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoData[0].lat}&lon=${geoData[0].lon}&units=imperial&appid=${apiKey}`;
        var weatherResponse = await fetch(weatherapi);
        
        if (!weatherResponse.ok) {
            throw await weatherResponse.json();
        }

        var weatherData = await weatherResponse.json();
        
        console.log(weatherData);
        await displayToday(weatherData);

        while (longForecast[0].firstChild) {
            longForecast[0].removeChild(longForecast[0].firstChild);
        }
        
        for (var i = 7; i < 43; i += 8) {
            await displayDay(weatherData.list[i]);
          }

    } catch (error) {
        console.error(error);
    }

    cityList(cityVal)
});



