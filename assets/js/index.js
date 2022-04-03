// need to fetch data + make sure it works DONE
// create functions - one that fetches data DONE
// one that loads onto page the weather info DONE
//one that saves to localstorage + creates a button DONE
//reminder to see why city=Montreal is always in url 
var localSaved = JSON.parse(localStorage.getItem("locations")) || [];
var locationInput = document.querySelector("#city");
var userForm = document.querySelector("#user-form");
var currentWeather = document.querySelector("#current-weather");
var listEl = document.querySelector(".details");
var currentWContainer = document.querySelector(".current-weather-container");
var cityBtnEl = document.querySelector("#city-buttons");
var futureWeatherContainer = document.querySelector(".future-container");
var buttonIdCounter = 0;

 var mph = function(x){
     var y = 2.236936;
 return (x * y).toFixed(2);
 }

var formSubmitHandler = function (event) {
    event.preventDefault();
    var location = locationInput.value.trim().toUpperCase();

    if (location) {
        var newSave = location;
        
        if (localSaved.indexOf(location)===-1){
                localSaved.push(newSave);
        };
        
        saveLocation();
        getApiLocation(location);
        locationInput.value = "";
        saveButtons();

    } else {
        alert("please enter a city name");
    }
};

var getApiLocation = function (location) {
    var apiURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=9c6774c19b3c951137a1b16a4660a14e";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                var latitude = data[0].lat;
                var longitude = data[0].lon;
                

                getWeather(latitude, longitude, location);
                // getFutureWeather
            });
        } else {
            alert("City not found")
        }
    })
}

var getWeather = function (lat, long, location) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&appid=9c6774c19b3c951137a1b16a4660a14e";
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayLocation(location, data);
                displayWeather(data);

                getFutureWeather(data);
                

            })
        } else {
            alert("Opps! something went wrong. Try again!");
        }
    })
}

var getFutureWeather = function (data) {
    futureWeatherContainer.innerHTML="";
    var dayForecast = document.createElement("div");
    dayForecast.classList.add("col-12", "dayforecast")
    dayForecast.textContent= "5-Day Forecast:"
    futureWeatherContainer.appendChild(dayForecast);

    for (var i = 1; i < 6; i++) {
        var dayEl = document.createElement("div");
        dayEl.classList.add("border", "col-12", "col-lg-2", "days");
        futureWeatherContainer.appendChild(dayEl);
        
        var days = document.createElement("ul");
        dayEl.appendChild(days);
        
        var date = document.createElement("li");
        date.classList.add("font-weight-bold", "days-text");
        date.textContent=moment.unix(data.daily[i].dt).format("L");
        days.appendChild(date);
        
        var icon = document.createElement("li");
        icon.setAttribute("class", "days-text");
        icon.innerHTML="<img src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png'>";
        days.appendChild(icon);
        
        var temp = document.createElement("li");
        temp.setAttribute("class", "days-text");
        temp.textContent= "Temp: " + Math.round(data.daily[i].temp.day) + " °C";
        days.appendChild(temp);
        
        var wind = document.createElement("li")
        wind.setAttribute("class", "days-text");
        wind.textContent= "Wind: " + mph(data.daily[i].wind_speed) + " MPH";
        days.appendChild(wind);
        
        var humidity = document.createElement("li");
        humidity.setAttribute("class", "days-text");
        humidity.textContent= "Humidity: " + data.daily[i].humidity + "%";
        days.appendChild(humidity);

    }

}

var displayLocation = function (location, data) {
    currentWeather.innerHTML = "";
    listEl.innerHTML = "";
    // console.log(location);
    currentWContainer.setAttribute("class", "border")
    var date = moment().format('MMMM Do YYYY')
    var weatherH2 = document.createElement("h2");
    weatherH2.innerHTML = location + " (" + date + ")" + "<img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png'>";
    currentWeather.setAttribute("class", "text-uppercase");
    currentWeather.appendChild(weatherH2);
}

var displayWeather = function (data) {
    debugger;
    var temp = document.createElement("li");
    temp.textContent = "Temp: " + Math.round(data.current.temp) + " °C (Feels like " + Math.round(data.current.feels_like) + " °C)";
    listEl.appendChild(temp);

    var wind = document.createElement("li");
    wind.textContent = "Wind: " + mph(data.current.wind_speed) + " MPH";
    listEl.appendChild(wind);

    var humidity = document.createElement("li");
    humidity.textContent = "Humidity: " + data.current.humidity + "%";
    listEl.appendChild(humidity);

    var uvIndex = document.createElement("li");
    if (data.current.uvi <= 2) {
        uvIndex.innerHTML = "UV Index: <span class='favourable px-2'>" + data.current.uvi + "</span>";
        listEl.appendChild(uvIndex);
    }
    else if (data.current.uvi > 2.1 && data.current.uvi <= 5) {
        uvIndex.innerHTML = "UV Index: <span class='moderate px-2'>" + data.current.uvi + "</span>";
        listEl.appendChild(uvIndex);
    } else {
        uvIndex.innerHTML = "UV Index: <span class='severe px-2'>" + data.current.uvi + "</span>";
        listEl.appendChild(uvIndex);
    }
}

var saveLocation = function () {
    //dont forget you dont want to have duplicate buttons!!
    localStorage.setItem("locations", JSON.stringify(localSaved));

}

var saveButtons = function () {
    cityBtnEl.innerHTML = "";
    for (var i = 0; i < localSaved.length; i++) {
        newBtn = document.createElement("button");
        newBtn.textContent = localSaved[i];
        newBtn.classList.add("text-center", "text-uppercase", "new-btn");
        newBtn.setAttribute("data-task-id", buttonIdCounter);
        buttonIdCounter++;
        cityBtnEl.appendChild(newBtn);

        newBtn.addEventListener("click", function (event) {
            getApiLocation(event.target.textContent);
            displayLocation(event.target.textContent);

            
        });
    };
    
} 
saveButtons();

userForm.addEventListener("submit", formSubmitHandler);
