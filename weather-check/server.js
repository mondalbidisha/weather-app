const express = require('express');
const BodyParser = require('body-parser');
const request = require('request');
const app = express();

const requestURL = 'http://api.weatherstack.com/current';
const access_token = '881e74e04132d381cc2fc0b3c9429191';

app.set('view engine', 'ejs'); // set the ejs as the rendering engine. ejs can be used out of the box from the 'views' folder
app.use(express.static('public')); // Express wont allow access to this file by default, so we need to expose it. This code allows us to access all of the static files within the ‘public’ folder.
app.use(BodyParser.urlencoded({ extended: true })); 

app.get('/', function(request, response) {
  response.render('index', {weather: null, error: null});
})

app.post('/', function (req, response) {
  response.render('index');
  console.log(req.body.city);
  let city = req.body.city;
  let requestAPI = `${requestURL}?access_key=${access_token}&query=${city}`; 
  // request(requestAPI, function (err, res, body) {
  //   if(err){
  //     response.render('index', {weather: null, error: 'Error, please try again'});
  //   } else {
  //     let weather = JSON.parse(body)
  //     if(weather.main == undefined){
  //       response.render('index', {weather: null, error: 'Error, please try again'});
  //     } else {
  //       let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
  //       response.render('index', {weather: weatherText, error: null});
  //     }
  //   }
  // });
  // // request(requestAPI, function(error, request, response) {
  // //   if(true) {
  // //     response.render('index', {
  // //       weather: null, 
  // //       error: 'Error, please try again'
  // //     })
  // //   }
  // // })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})