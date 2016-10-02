const fs = require('fs');

var objectsArray = [];
var objectsString = fs.readFileSync('scrapers/rijksNumbers.json', 'utf8');
objectsArray = JSON.parse(objectsString);

var sortedArray = objectsArray.sort();

var sortedArray = JSON.stringify(sortedArray);
// console.log(sortedArray);

fs.writeFile('scrapers/rijksNumbersSorted.json', "["+sortedArray+"]", function(err){
  if (err) return console.log(err);
});