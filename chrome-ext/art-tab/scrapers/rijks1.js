const fs = require('fs');
const unirest = require('unirest');


console.log ("I'm working!");

unirest.get("https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=w5b8sjYU&format=json")
.type('json')
.end(function(response){
  // console.log(response.body.artObject.title);

});

unirest.get("https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=w5b8sjYU&format=json")
.type('json')
.end(function(response){
  // console.log(response.body.artObject.title);
  var output = response.body.artObject.title;
  return output;
});


// var output = unirest.get("https://www.rijksmuseum.nl/api/en/collection/sk-c-5?key=w5b8sjYU&format=json").type('json').end(function(response){response.body});

console.log(rijks());