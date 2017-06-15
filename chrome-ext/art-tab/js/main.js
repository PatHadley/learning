$(function(){

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var randomNum = getRandomInt(0, artefacts.length);


  // $('#collSelector').ajaxForm(function(){

  // });



  // $(".menu").click(function(){


  //   if ($( "#tateSelect").checked) {
      // var randomArtefact = $(tatefacts[randomNum]);

      // TateLoader
      // var artefactToLoad = '<div id="labels"><h1><a href="'+randomArtefact[0].link+'">'+randomArtefact[0].title+'</a></h1><p><a href="http://www.tate.org.uk/search?q='+randomArtefact[0].creator+'">'+randomArtefact[0].creator+'</a></p></div>';
    // } else if ($( "#rijkSelect").checked){
      var randomArtefact = $(artefacts[randomNum]);

  //     // RijksLoader
      var artefactToLoad = '<div id="labels"><h1><a href="https://www.rijksmuseum.nl/en/collection/'+randomArtefact[0].id+'">'+randomArtefact[0].title+'</a></h1><p><a href="https://www.rijksmuseum.nl/en/search?p=1&ps=12&involvedMaker='+randomArtefact[0].creator+'&st=OBJECTS">'+randomArtefact[0].creator+'</a></p></div>';
    // };
  //   // alert("CLICKEDY CLICK!");

    $("#container").css({'background-image': 'url('+randomArtefact[0].imgUrl+')'});

    $("#container").append(artefactToLoad);
  
  // });

});

