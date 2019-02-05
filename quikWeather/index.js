const request = require('request');
const argv = require('yargs').argv;

let apiKey = 'a1d91c0b4ee4ce1831f03783b01f101d';
let city = argv.c || 'hove';
let system = 'metric'
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${system}&appid=${apiKey}`


request(url, function (err, response, body) {
  if(err){
    console.log('error:', error);
  } else {
    let weather = JSON.parse(body)
    let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
	console.log(message);
  }
});


