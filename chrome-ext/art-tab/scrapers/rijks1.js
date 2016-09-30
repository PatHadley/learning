const fs = require('fs');
const unirest = require('unirest');


console.log ("I'm working!");

var objectNums = [];


var writeArray = function(objectNums){
  fs.writeFile('OilPaintingObjectNums.json', "["+objectNums+"]", function(err){
    if (err) return console.log(err);
  });
};



var processRijks = function(output){
  if (output){
    // console.log(output.title);
    // console.log(output.objectNumber);
    objectNums.push('\n"'+output.objectNumber+'"');
    writeArray(objectNums);
  };
};


var getRijks = function (){

  for (var i = 1; i <= 1000; i++) {
    unirest.get("https://www.rijksmuseum.nl/api/en/collection/sk-c-"+i+"?key=w5b8sjYU&format=json&imgonly=true")
    .type('json')
    .end(function(response){
      var output = response.body.artObject;
      processRijks(output);
    });
  }

  
};


getRijks();






var collPrefixes = [
  "AK-MAK",
  "AK-NM",
  "AK-RAK",
  "AK-RBK",
  "BK",
  "BK-AM",
  "BK-KOG",
  "BK-NM",
  "NG",
  "NG-NM",
  "NG-VG",
  "SK-A",
  "SK-B",
  "SK-C",
  "RP-F",
  "RP-P",
  "RP-P-OB",
  "RP-T"
];

// var years = [];

// for (var i = 0; i <= 115; i++) {
//   years.push(i+1900);
// };

// var hundreds = [];

// for (var i = 1; i <= 100; i++){
//   hundreds.push(i);
// };