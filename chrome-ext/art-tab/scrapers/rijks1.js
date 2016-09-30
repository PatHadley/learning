const fs = require('fs');
const unirest = require('unirest');


console.log ("I'm working!");

var objectDetails = [];


var writeArray = function(objectDetails){
  fs.writeFile('OilPaintingObjects.json', "["+objectDetails+"]", function(err){
    if (err) return console.log(err);
  });
};



var processRijks = function(output){
  if (output){
    var currentObject = {
      id: output.objectNumber,
      title: output.title,
      creator: output.principalMakers[0].name,
      imgUrl: output.webImage.url,
    };
    // console.log(currentObject);
    currentObjString = JSON.stringify(currentObject);
    objectDetails.push('\n'+currentObjString);
    writeArray(objectDetails);
    // console.log(objectDetails);
  };
};


// var getRijks = function (){

//   for (var i = 2; i <= 1000; i++) {
//     unirest.get("https://www.rijksmuseum.nl/api/en/collection/sk-c-"+i+"?key=w5b8sjYU&format=json&imgonly=true")
//     .type('json')
//     .end(function(response){
//       var output = response.body.artObject;
//       processRijks(output);
//     });
//   }
// };

var getRijks = function (){
  var objectsArray = [];
  var objectsString = fs.readFileSync('OilPaintingObjectNums.json', 'utf8');
  objectsArray = JSON.parse(objectsString);

  for (var i = objectsArray.length - 1; i >= 0; i--) {
    unirest.get("https://www.rijksmuseum.nl/api/en/collection/"+objectsArray[i]+"?key=w5b8sjYU&format=json&imgonly=true")
    .type('json')
    .end(function(response){
      if (response.body.artObject.webImage){
        var output = response.body.artObject;
        processRijks(output);
      };
    });
  };
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