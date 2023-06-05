document.addEventListener("DOMContentLoaded", function () {
  var cityName = "";
  var lon = "";
  var lat = "";
  var titleName = document.querySelector(".cityName");
  var searchHistory = document.querySelector("#searchHistory");
  var error = document.querySelector("#error");
  var btnSuccess = document.querySelector(".btn");
  var btnClear = document.querySelector("#clear");
  var cities = [];

  btnSuccess.addEventListener("click", searchBtnListner);
  btnClear.addEventListener("click", clearHistory);

  // Event Listener function grabs user input, removes spacing and attaches name of city to api search
  function searchBtnListner(event) {
    var inputEl = event.target;
    cityName = inputEl.parentElement.previousElementSibling.value;
    var newCityName = cityName.trim();
    newCityName = newCityName.replace(" ", "_");

    var apiSearch =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      newCityName +
      "&limit=1&appid=31fbadef98a417ef6f0e39d36c133d27";

    cityLookup(apiSearch);
  }

  // cityLookup function uses city name api to grabe longitude and latitude then makes a new api search with the new information to pull the weather
  function cityLookup(apiString) {
    fetch(apiString)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length === 0) {
          error.textContent = "*City Not Found";
          throw new Error("JSON response empty.");
        } else {
        }

        lon = data[0].lon;
        lat = data[0].lat;

        var fiveDayForcastAPI =
          "https://api.openweathermap.org/data/2.5/forecast?lat=" +
          lat +
          "&lon=" +
          lon +
          "&limit=1&appid=31fbadef98a417ef6f0e39d36c133d27&units=imperial";

        var currentWeatherAPI =
          "https://api.openweathermap.org/data/2.5/weather?lat=" +
          lat +
          "&lon=" +
          lon +
          "&limit=1&appid=31fbadef98a417ef6f0e39d36c133d27&units=imperial";

        currentWeather(currentWeatherAPI);

        fetch(fiveDayForcastAPI)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            for (var i = 0; i <= 32; i += 8) {
              var weatherIcon = data.list[i].weather[0].main;
              var icon = document.querySelector("#icon" + i);
              var temp = document.querySelector("#temp" + i);
              var wind = document.querySelector("#wind" + i);
              var humidity = document.querySelector("#humidity" + i);
              temp.textContent = "Temp:  " + data.list[i].main.temp + "°F";
              wind.textContent = "Wind: " + data.list[i].wind.speed + "MPH";
              humidity.textContent =
                "Humidity: " + data.list[i].main.humidity + "%";

              if (weatherIcon === "Clouds") {
                icon.classList.add("fa-solid", "fa-cloud");
              } else if (weatherIcon === "Rain") {
                icon.classList.add("fa-solid", "fa-cloud-showers-heavy");
              } else {
                icon.classList.add("fa-regular", "fa-sun");
              }
            }
          });
      });
  }
});