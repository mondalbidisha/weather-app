const express = require('express');
const BodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const app = express();

const requestURL = 'http://api.weatherstack.com/current'; // Weather API used to get weather information
const access_token = '881e74e04132d381cc2fc0b3c9429191'; // access_token, allows 1000 API calls/month
let weatherData = null;
let renderTemplate, imageSource, styleSource, errorText;
const portNumber = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // set the ejs as the rendering engine. ejs can be used out of the box from the 'views' folder
const publicDirectoryPath = path.join(__dirname, './public'); // Exposes path to publc folder where all template files reside
app.use(express.static(publicDirectoryPath)); // Express wont allow access to this file by default, so we need to expose it. This code allows us to access all of the static files within the ‘public’ folder.
app.use(BodyParser.urlencoded({ extended: true })); 
app.get('/', function(request, response) {
  response.redirect('home'); // Redirects all requests to 'home'  route
})

app.get('/home', function(request, response) {
  response.render('index', { error: errorText }); // renders form to accept location details
})

app.post('/', function (req, response) {
  let city = req.body.city;
  errorText = null;
  getWeatherInfo(city, (err, res) => {
    if(err) {
      errorText = "SOMETHING WENT WRONG! PLEASE TRY AGAIN."; // Low level errors 
      return response.redirect('home');
    } else if(!res.current) {
      errorText = "SOMETHING WENT WRONG! LOCATION COULD NOT FOUND. TRY ANOTHER SEARCH..."; // When location is not found
      return response.redirect('home');
    }
    weatherData = res;
    let currentWeather = res.current.weather_descriptions[0].toLowerCase();

    // Renders custom templates basis string present in 'weather description' array
    
    if(currentWeather.includes("rain")) {
      renderTemplate = "custom";
      styleSource = "/css/custom-rain.css";
      imageSource = "./../css/images/rainy.jpg";
      response.redirect('weather-details');
    } else if(currentWeather.includes("cloud")) {
      renderTemplate = "custom";
      styleSource = "/css/custom-cloud.css";
      imageSource = "./../css/images/cloudy.jpg";
      response.redirect('weather-details');
    } else if(currentWeather.includes("sunny")) {
      renderTemplate = "custom";
      styleSource = "/css/custom-sun.css";
      imageSource = "./../css/images/sunny.jpg";
      response.redirect('weather-details');
    } else if(currentWeather.includes("clear")) {
      renderTemplate = "custom";
      styleSource = "/css/custom-clear.css";
      imageSource = "./../css/images/clear.jpg";
      response.redirect('weather-details');
    } else if(currentWeather.includes("haze")) {
      renderTemplate = "custom";
      styleSource = "/css/custom-overcast.css";
      imageSource = "./../css/images/haze.jpg";
      response.redirect('weather-details');
    } else if(currentWeather.includes("overcast")) {
      renderTemplate = "custom";
      styleSource = "/css/custom-overcast.css";
      imageSource = "./../css/images/overcast.jpg";
      response.redirect('weather-details');
    } else if(currentWeather.includes("snow")) {
      renderTemplate = "custom";
      styleSource = "/css/custom-snow.css";
      imageSource = "./../css/images/snow.jpg";
      response.redirect('weather-details');
    } else {
      renderTemplate = "custom";
      styleSource = "/css/custom-fallback.css";
      imageSource = "./../css/images/fallback.jpg";
      response.redirect('weather-details');
    }
  })
})

app.get('/weather-details', function(request, response) {
  response.render(renderTemplate, { 
    weatherData: weatherData,
    styleSource: styleSource,
    imageSource: imageSource
  });
})

const getWeatherInfo = (city, callback) => {
  let requestAPI = `${requestURL}?access_key=${access_token}&query=${city}`; 
  let parsedBodyData;
  request(requestAPI, function (error, response, body) {
    if(error) {
      console.log("ERROR! SOMETHING WENT WRONG.");      
    } else if(response && body) {
      parsedBodyData = JSON.parse(body);
      if(parsedBodyData.success == false && parsedBodyData.error) {
        console.log(parsedBodyData.error.info);      
      }
      callback(error, parsedBodyData);
    }
  });
}

app.listen(portNumber, function () {
  console.log(`Weather app listening on port ${portNumber}!` )
})