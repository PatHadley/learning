const fs = require('fs');
const unirest = require('unirest');
// const https = require('https');
// const http = require('http');


console.log ("I'm working!");

var objectDetails = [];


var writeArray = function(objectDetails){
  fs.appendFile('scrapers/rijksObjects.json', "["+objectDetails+"]", function(err){
    if (err) return console.log(err);
  });
};


var processRijks = function(output){
  if (output.principalMakers){
    var currentObject = {
      id: output.objectNumber,
      title: output.title,
      creator: output.principalMakers[0].name,
      imgUrl: output.webImage.url
    };
    console.log("Worked with: "+currentObject);
    currentObjString = JSON.stringify(currentObject);
    objectDetails.push('\n'+currentObjString);
    writeArray(objectDetails);

  } else if (output) {
    var currentObject = {
      id: output.objectNumber,
      title: output.title,
      creator: "anonymous",
      imgUrl: output.webImage.url
    };
    console.log("Worked with: "+currentObject);
    currentObjString = JSON.stringify(currentObject);
    objectDetails.push('\n'+currentObjString);
    writeArray(objectDetails);
  };
};

var getRijks = function (){
  var objectsArray = [];
  var objectsString = fs.readFileSync('scrapers/rijksNumbers.json', 'utf8');
  objectsArray = JSON.parse(objectsString);

  for (var i = 0; i < (objectsArray.length/10); i++) {

     // console.log("https://www.rijksmuseum.nl/api/en/collection/"+objectsArray[i]+"?key=w5b8sjYU&format=json&imgonly=true");

  //   var options = {
  //     hostname: "www.rijksmuseum.nl",
  //     path: "/api/en/collection/"+objectsArray[i]+"?key=w5b8sjYU&format=json&imgonly=true",
  //     method: 'GET'
  //   };

  //   var req = https.request(options, (res) => {
  //     console.log('statusCode:', res.statusCode);
  //     res.setEncoding('utf8');

  //     res.on('data', (d) => {
  //       // process.stdout.write(d);
  //       response = (`BODY: ${d}`);
  //       console.log(response);
  //       // if ((response.body === null) || (response.body === undefined)){
  //       //   console.log("empty response");
  //       // } else if ((response.body.artObject === null) || (response.body.artObject === undefined)){
  //       //   console.log("no artObject");
  //       // } else if (response.body.artObject.webImage){
  //       //   var output = response.body.artObject;
  //       //   processRijks(output);
  //       // };
  //     });
  //   });
  //   req.end();

  //   req.on('error', (e) => {
  //     console.log(`problem with request: ${e.message}`);
  //   });



    unirest.get("https://www.rijksmuseum.nl/api/en/collection/"+objectsArray[i]+"?key=w5b8sjYU&format=json&imgonly=true")
    .type('json')
    .end(function(response){
      if (!response.ok){

        var status = JSON.stringify(response);
        console.log("Weird status: "+status);
        console.log("Status: "+response.statusType);
      } else if ((response.body === null) || (response.body === undefined)){
        console.log("empty response");
      } else if ((response.body.artObject === null) || (response.body.artObject === undefined)){
        console.log("no artObject");
      } else if (response.body.artObject.webImage){
        var output = response.body.artObject;
        processRijks(output);
      };
    });
  };
};



getRijks();
