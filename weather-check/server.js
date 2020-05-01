const express = require('express');
const BodyParser = require('body-parser');
const request = require('request');
const app = express();

const requestURL = 'http://api.weatherstack.com/current'; // Weather API used to get weather information
const access_token = '881e74e04132d381cc2fc0b3c9429191'; // access_token, allows 1000 API calls/month

app.set('view engine', 'ejs'); // set the ejs as the rendering engine. ejs can be used out of the box from the 'views' folder
app.use(express.static('public')); // Express wont allow access to this file by default, so we need to expose it. This code allows us to access all of the static files within the ‘public’ folder.
app.use(BodyParser.urlencoded({ extended: true })); 

app.get('/', function(request, response) {
  response.render('index');
})

app.post('/', function (req, response) {
  console.log(req.body.city);
  let city = req.body.city;
  getWeatherInfo(city, (err, res) => {
    if(err) {
      return response.render('index', {error: "LOCATION NOT FOUND"}); 
    }
    response.render('index', {error: res.current.weather_descriptions[0]});
    console.log(res.current.weather_descriptions[0]);
  })
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})