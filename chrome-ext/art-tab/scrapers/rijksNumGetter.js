const fs = require('fs');
const unirest = require('unirest');


console.log ("I'm working!");

var objectDetails = [];


var writeArray = function(objectDetails){

  objectDetails = objectDetails.sort();

  fs.appendFile('scrapers/rijksNumbers.json', "["+objectDetails+"]", function(err){
    if (err) return console.log(err);
  });
};

var chooseCollection = function(){
  var simplePrefixes = [
    "AK-MAK",
    "BK-AM",
    "BK-KOG",
    "BK-NM",
    "NG",
    "NG-NM",
    "RP-P-OB",
    "SK-A",
    "SK-B",
    "SK-C",
  ];

  var yearPrefixes = [
    "AK-RAK",
    "BK",
    "NG",
    "RP-F",
    "RP-P",
    "RP-T"
  ];

  // for (var i = simplePrefixes.length - 1; i >= 0; i--) {
  //   var collPrefix = (simplePrefixes[i]);
  //   getSimpleRijks(collPrefix);
  // };

  for (var i = yearPrefixes.length - 1; i >= 0; i--) {
    var collPrefix = (yearPrefixes[i]);
    getYearRijks(collPrefix);
  };
};

var processRijks = function(output){
  if (output){
    var currentObject = output.objectNumber;
      // console.log(currentObject);
    currentObjString = JSON.stringify(currentObject);
    objectDetails.push('\n'+currentObjString);
    writeArray(objectDetails);
  };
};


var getSimpleRijks = function (collPrefix){

  for (var i = 100; i >= 0; i--) {
    unirest.get("https://www.rijksmuseum.nl/api/en/collection/"+collPrefix+"-"+[i]+"?key=w5b8sjYU&format=json&imgonly=true")
    .type('json')
    .end(function(response){
      if (!response.ok){
        console.log("Status: "+response.code)
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

var getYearRijks = function (collPrefix){

  for (var i = 100; i <= 115; i++){

    for (var j = 100; j >= 0; j--) {
      unirest.get("https://www.rijksmuseum.nl/api/en/collection/"+collPrefix+"-"+[i+1900]+"-"+[j]+"?key=w5b8sjYU&format=json&imgonly=true")
      .type('json')
      .end(function(response){
        if (!response.ok){
          console.log("Status: "+response.code)
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
}; 

chooseCollection();
