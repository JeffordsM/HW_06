var input = $("#text_input")
var target = $("#target")
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
        a.addClass("cityBtn");
        a.attr("data-name", x);
        a.text(x);
        buttons.append(a);
    });
}


function displayWeather() {

    var APIKey = "5d325ab0a48a69f68729abab202f44bf"

    var thisCity = $(this).attr("data-name") || newCity

    var City = thisCity.split(" ").join("+");

    var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${City}&APPID=${APIKey}`

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

        console.log(error)
        if (error == 1) {
            return
        }

        var newWords = $("<div>")
        newWords.append($(`<h2>City: ${response.name}</h2>`))
        newWords.append($(`<h2>Temp: ${response.main.temp}</h2>`))
        newWords.append($(`<h2>Wind: ${response.wind.speed}</h2>`))
        newWords.append($(`<h2>Weather: ${response.weather[0].main}</h2>`))

        target.html(newWords);



        addCity();
    })
}

function storeBtn() {
    localStorage.setItem("prevCities", JSON.stringify(previousCities));
}

buttons.on("click", ".cityBtn", displayWeather);

makeButtons();