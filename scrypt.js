var input = $("#text_input")
var targetHead = $("#header_target")
var targetInfo = $("#info_target")
var targetForcast = $("#forcast_target")
var form = $("#city_input")
var buttons = $("#buttons-view")

var previousCities;

previousCities = JSON.parse(localStorage.getItem("prevCities")) || ["Denver"];

var newCity = ""

var error;

form.on("submit", function (event) {
    event.preventDefault();

    error = 0

    var inputText = input.val().trim();
    newCity = inputText

    displayWeather();
    console.log(error)
});

function addCity() {
    var text = input.val().trim();
    var inputText = text.charAt(0).toUpperCase() + text.slice(1)

    newCity = inputText
    if (inputText === "") {
        return;
    }
    inputText.charAt(0).toUpperCase() + inputText.slice(1)
    previousCities.push(inputText)
    input.val("")
    makeButtons();
    storeBtn();
}

function makeButtons() {

    buttons.empty();

    previousCities.forEach(function (x) {
        var a = $("<button>");
        a.addClass("cityBtn btn btn-primary btn-lg btn-block");
        a.attr("data-name", x);
        a.text(x);
        buttons.append(a);
    });
}


function displayWeather() {

    var APIKey = "5d325ab0a48a69f68729abab202f44bf"

    var thisCity = $(this).attr("data-name") || newCity

    var City = thisCity.split(" ").join("+");

    var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${City}&units=imperial&APPID=${APIKey}`

    $.ajax({
        url: queryURL,
        method: "GET",
        error: function (xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
            error = 1;
            input.val("")
        }
    }).then(function (response) {

        console.log(response)

        if (error == 1) {
            return
        }


        var newWords = $("<div>")
        targetHead.html($(`<h2>${response.name} (${moment().format('L')}) <img id="wicon" src="http://openweathermap.org/img/w/${response.weather[0].icon}.png" alt="Weather icon"></h2>`))
        newWords.append($(`<h3>Temperature: ${response.main.temp}</h3>`))
        newWords.append($(`<h3>Humidity: ${response.main.humidity}%</h3>`))
        newWords.append($(`<h3>Wind Speed: ${response.wind.speed}</h3>`))

        targetInfo.html(newWords);

        addUV(response.coord.lat, response.coord.lon);
        addForcast(response.name)

        addCity();
    })
}

function addUV(x, y) {

    var APIKey = "5d325ab0a48a69f68729abab202f44bf"

    var queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${x}&lon=${y}`

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response)
        targetInfo.append($(`<h3>UV Index: ${response.value}</h3>`))
    })

}

function addForcast(z) {

    var APIKey = "5d325ab0a48a69f68729abab202f44bf"

    var queryURL = `http://api.openweathermap.org/data/2.5/forecast/?q=${z}&units=imperial&appid=${APIKey}`

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        targetForcast.empty();
        var t = 0
        for (i=5; i<40; i+=8) {
            t++
            console.log(response.list[i])
            var newForcast = $("<div>")
            newForcast.addClass("forcast")
            newForcast.append(`<h3>${moment().add(t, 'days').format('L')}</h3>`)
            newForcast.append(`<img id="wicon" src="http://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png" alt="Weather icon"></h2>`)
            newForcast.append(`<h3>Temperature: ${response.list[i].main.temp}</h3>`)
            newForcast.append(`<h3>Humidity: ${response.list[i].main.humidity}%</h3>`)
            targetForcast.append(newForcast)
        }
    })

}

function storeBtn() {
    localStorage.setItem("prevCities", JSON.stringify(previousCities));
}

buttons.on("click", ".cityBtn", displayWeather);

makeButtons();