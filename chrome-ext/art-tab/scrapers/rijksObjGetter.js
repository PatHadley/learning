const fs = require('fs');
const unirest = require('unirest');


console.log ("I'm working!");

var objectDetails = [];


var writeArray = function(objectDetails){
  fs.writeFile('scrapers/rijksObjects.json', "["+objectDetails+"]", function(err){
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
    // console.log(currentObject);
    currentObjString = JSON.stringify(currentObject);
    objectDetails.push('\n'+currentObjString);
    writeArray(objectDetails);
  };
};

var getRijks = function (){
  var objectsArray = [];
  var objectsString = fs.readFileSync('scrapers/rijksNumbers.json', 'utf8');
  objectsArray = JSON.parse(objectsString);

  for (var i = (objectsArray.length /10)- 1; i >= 0; i--) {
    // console.log("https://www.rijksmuseum.nl/api/en/collection/"+objectsArray[i]+"?key=w5b8sjYU&format=json&imgonly=true");
    unirest.get("https://www.rijksmuseum.nl/api/en/collection/"+objectsArray[i]+"?key=w5b8sjYU&format=json&imgonly=true")
    .type('json')
    .end(function(response){
      if (!response.ok){
        console.log("Weird status: "+response);
        console.log("Status: "+response.statusType);
      } else if ((response.body === null) || (response.body === undefined)){
        // console.log("empty response");
      } else if ((response.body.artObject === null) || (response.body.artObject === undefined)){
        // console.log("no artObject");
      } else if (response.body.artObject.webImage){
        var output = response.body.artObject;
        processRijks(output);
      };
    });
  };
}; 



getRijks();
