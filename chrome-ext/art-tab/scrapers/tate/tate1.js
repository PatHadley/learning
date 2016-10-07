const fs = require("fs");
const path = require("path");

console.log("I'm working!");

// read directory contents.
//   if contents are folders
//     read directory contents
//   if contents are files
//     read all file contents
//     if file includes thumbnailURL
//       write object with: acno, all_artists, shortTitle, thumbnailURL (subs _10 for _8), url
//       add object to array
//       write array to file
//     else do nothing


path = 'scrapers/tate/artworks/000/a00039-1073.json'

var fileReader = function(path){
  fs.readFile(path, (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}




























// var objGetter = function (){
//   var p = "scrapers/tate/artworks";

//   fs.readdir(p, function (err, files) {
//     if (err) {
//       console.log('error');
//       throw err;
//     }
//     console.log(files);
//     statGetter(p, files);
//   });
// };

// // objGetter();



// var statGetter = function(p, files){
//   // var p = "scrapers/tate/artworks/a/000";

//   fs.stat(p, function (err, stats) {
//     if (err) {
//       console.log('error');
//       throw err;
//     }
//     console.log(stats);

//     if (stats.isFile()){
//       console.log("this is where we get the file's contents")
//     } else if (stats.isDirectory()){
//       console.log("look at the next directory?")
//     }



//     console.log("isFile ? " + stats.isFile());
//     console.log("isDirectory ? " + stats.isDirectory());    
//   });
// };


// for (var i = files.length - 1; i >= 0; i--) {

// fs.stat(files[0]), function(err, stats){
//   if (err){
//     console.log('error');
//     throw err;
//   }
//   console.log(stats);
// }



  // fs.stat(files[2]), function (err, stats) {
  //  if (err) {
  //      return console.error(err);
  //  }
  //  console.log(stats);
  //  console.log("Got file info successfully!");
   
  //  // Check file type
  //  console.log("isFile ? " + stats.isFile());
  //  console.log("isDirectory ? " + stats.isDirectory());    
  // };