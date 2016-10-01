$(function(){

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var randomNum = getRandomInt(0, artefacts.length);

  var randomArtefact = $(artefacts[randomNum]);


  // artefactToLoad = '<div id="labels"><h3>'+randomArtefact[0].title+'</h3><p>'+randomArtefact[0].creator+'</p></div><img id="hero" src="'+randomArtefact[0].imgUrl+'">'

  artefactToLoad = '<div id="labels"><h1>'+randomArtefact[0].title+'</h1><p>'+randomArtefact[0].creator+'</p></div>'

  $("#container").css({'background-image': 'url('+randomArtefact[0].imgUrl+')'});

  $("#container").append(artefactToLoad);

});
