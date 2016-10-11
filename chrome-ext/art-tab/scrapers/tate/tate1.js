const fs = require('graceful-fs');
const es = require("event-stream");

console.log("I'm working!");

var rootPath = 'scrapers/tate/artworks';

var objectDetails = [];

var writeArray = function(objectDetails){
  // console.log(objectDetails);

  // fs.appendFile('scrapers/tate/tateObjects.json', objectDetails, function(err){
  //   if (err) return console.log(err);
  // });

  var objectString = JSON.stringify(objectDetails);

  fs.appendFileSync('scrapers/tate/tateObjects.json', (objectString+'\n'), 'utf8');

};

var fileReader = function(location){
  var oneFile = fs.readFileSync(location, 'utf8');

  var fileInfo = JSON.parse(oneFile);

  if (fileInfo.thumbnailUrl){
    var usefulInfo = {
      iD: fileInfo.acno,
      title: fileInfo.catalogueGroup.title,
      creator: fileInfo.all_artists,
      imgUrl: fileInfo.thumbnailUrl.replace(/_8/i, '_10'),
      link: fileInfo.url
    };
    if (usefulInfo.title === undefined){
      usefulInfo.title = 'Untitled';
    }

    // objectDetails.push(usefulInfo);
    writeArray(usefulInfo);
    // console.log(objectDetails);
  }  
};

var fileGetter = function(location){
  fs.stat(location, function(err, stats){
    if (err) {
      console.log('error');
      throw err;
    } else if (stats.isFile()) {
      // console.log ("I'm a file");
      fileReader(location);
    } else if (stats.isDirectory()) {
      // console.log ("I'm a directory");
      fs.readdir(location, function (err, files){
        if (err) {
          console.log('error');
          throw err;
        }
        // console.log("Files: "+files);
        for (var i = files.length - 1; i >= 0; i--) {
          var newLoc = location +"/"+ files[i];
          // console.log (newLoc);
          fileGetter(newLoc);
        }
      })
    }
  })
}

fileGetter(rootPath);
