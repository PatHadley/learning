const fs = require('fs');

var objectsArray = [];
var objectsString = fs.readFileSync('js/rijksObjects.js', 'utf8');
objectsArray = JSON.parse(objectsString);

function uniq(a) {
   return Array.from(new Set(a));
}

var uniqueArray = uniq(objectsArray);

console.log(uniqueArray);


// var sortedArray = uniqueArray.sort();

// var sortedArray = JSON.stringify(sortedArray);
// console.log(sortedArray);

// fs.writeFile('js/rijksObjects2.js', "["+sortedArray+"]", function(err){
//   if (err) return console.log(err);
// });