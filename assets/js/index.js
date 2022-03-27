// need to fetch data + make sure it works
// create functions - one that fetches data
// one that loads onto page the weather info
//one that saves to localstorage + creates a button
var locationInput = document.querySelector("#city");
var userForm = document.querySelector("#user-form");
var currentWeather = document.querySelector("#current-weather");
var listEl = document.querySelector(".details");
var currentWContainer = document.querySelector(".current-weather-container");
// var submitBtn = document.querySelector(".get-btn");

var formSubmitHandler = function (event) {
    event.preventDefault();
    var location = locationInput.value.trim();

    if (location) {
        getApiLocation(location);
        locationInput.value = "";

        displayLocation(location);
    } else {
        alert("please enter a city name");
    }
};

var getApiLocation = function (location) {
    var apiURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=1&appid=9c6774c19b3c951137a1b16a4660a14e";

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var latitude = data[0].lat;
                var longitude = data[0].lon;
                // console.log(latitude, longitude);

                getWeather(latitude, longitude);
            });
        } else {
            alert("City not found")
        }
    })
}

var getWeather = function (lat, long) {
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&appid=9c6774c19b3c951137a1b16a4660a14e";
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayWeather(data);

            })
        } else {
            alert("Opps! something went wrong. Try again!");
        }
    })
}

var displayLocation = function (location) {
    currentWeather.innerHTML = "";
    listEl.innerHTML = "";
    currentWContainer.setAttribute("class", "border")
    var date = moment().format('MMMM Do YYYY')
    var weatherH2 = document.createElement("h2");
    weatherH2.textContent = location + " (" + date + ")";
    currentWeather.setAttribute("class", "text-uppercase");
    currentWeather.appendChild(weatherH2);
}

var displayWeather = function (data) {
    var temp = document.createElement("li");
    temp.textContent = "Temp: " + Math.round(data.current.temp) + "°C (Feels like " + Math.round(data.current.feels_like) + "°C)";
    listEl.appendChild(temp);

    var wind = document.createElement("li");
    //dont forget to fix this!!!!! not current mph, but mps
    wind.textContent = "Wind: " + data.current.wind_speed + " MPH";
    listEl.appendChild(wind);

    var humidity = document.createElement("li");
    humidity.textContent = "Humidity: " + data.current.humidity + "%";
    listEl.appendChild(humidity);

    var uvIndex = document.createElement("li");
    if (data.current.uvi <= 2) {
        uvIndex.innerHTML = "UV Index: <span class='favourable'>" + data.current.uvi + "</span>";
        listEl.appendChild(uvIndex);
    }
    else if (data.current.uvi > 2.1 && data.current.uvi <= 5) {
        uvIndex.innerHTML = "UV Index: <span class='moderate'>" + data.current.uvi + "</span>";
        listEl.appendChild(uvIndex);
    } else {
        uvIndex.innerHTML = "UV Index: <span class='severe'>" + data.current.uvi + "</span>";
        listEl.appendChild(uvIndex);
    }
}




userForm.addEventListener("submit", formSubmitHandler);