$(function(){

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var randomNum = getRandomInt(0, artefacts.length);

  // var randomArtefact = $(artefacts[randomNum]);
  var randomArtefact = $(tatefacts[randomNum]);

  artefactToLoad = '<div id="labels"><h1><a href="https://www.rijksmuseum.nl/en/collection/'+randomArtefact[0].id+'">'+randomArtefact[0].title+'</a></h1><p><a href="https://www.rijksmuseum.nl/en/search?p=1&ps=12&involvedMaker='+randomArtefact[0].creator+'&st=OBJECTS">'+randomArtefact[0].creator+'</a></p></div>'

  $("#container").css({'background-image': 'url('+randomArtefact[0].imgUrl+')'});

  $("#container").append(artefactToLoad);

});
