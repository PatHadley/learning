const fs = require("fs");
const path = require("path");

console.log("I'm working!");

// read directory contents.
//   if contents are folders
//     read directory contents
//   if contents are files
//     read all file contents
//     if file includes thumbnailURL
//       write object with: acno, all_artists, shortTitle, thumbnailUrl (subs _10 for _8), url
//       add object to array
//       write array to file
//     else do nothing


var rootPath = 'scrapers/tate/artworks';
// var rootPath = 'scrapers/tate/artworks/a/000/a00001-1035.json';




var fileReader = function(location){
  var oneFile = fs.readFileSync(location, 'utf8');

  var fileString = JSON.parse(oneFile);

  if (fileString.thumbnailUrl){
    var usefulInfo = {
      iD: fileString.acno,
      title: fileString.catalogueGroup.shortTitle,
      creator: fileString.all_artists,
      imgUrl: fileString.thumbnailUrl.replace(/_8/i, '_10'),
      link: fileString.url
    };
    console.log(usefulInfo);
  }

  
};

// fileReader(location);




var fileGetter = function(location){
  fs.stat(location, function(err, stats){
    if (err) {
      console.log('error');
      throw err;
    } else if (stats.isFile()) {
      console.log ("I'm a file");
      fileReader(location);
    } else if (stats.isDirectory()) {
      console.log ("I'm a directory");
      fs.readdir(location, function (err, files){
        if (err) {
          console.log('error');
          throw err;
        }
        console.log("Files: "+files);
        for (var i = files.length - 1; i >= 0; i--) {
          var newLoc = location +"/"+ files[i];
          console.log (newLoc);
        }
      })
    }

  })
}




fileGetter(rootPath);





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