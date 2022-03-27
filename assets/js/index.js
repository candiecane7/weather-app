// need to fetch data + make sure it works
// create functions - one that fetches data
// one that loads onto page the weather info
//one that saves to localstorage + creates a button
var locationInput = document.querySelector("#city");
var userForm = document.querySelector("#user-form");
var currentWeather = document.querySelector("#current-weather");
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
    var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=9c6774c19b3c951137a1b16a4660a14e";
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
            displayWeather(data);
            })
        } else {
            alert("Opps! something went wrong. Try again!");
        }
    })
}

var displayLocation = function(location){

    var date = moment().format('MMMM Do YYYY')
    var weatherH2 = document.createElement("h2");
    weatherH2.textContent = location + " (" + date + ")";
    currentWeather.setAttribute("class", "border");
    currentWeather.appendChild(weatherH2);
}

var displayWeather = function(data){

}

userForm.addEventListener("submit", formSubmitHandler);