$(function(){

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var randomNum = getRandomInt(0, artefacts.length);

  var randomArtefact = $(artefacts[randomNum]);

  // console.log(randomArtefact[0].creator);

  artefactToLoad = '<h3>'+randomArtefact[0].title+'</h3><p>'+randomArtefact[0].creator+'</p><img id="hero" src="'+randomArtefact[0].imgUrl+'">'

  $("#container").append(artefactToLoad);


  // $('img').attr("src", randomArtefact[0].imgUrl);


});






// $.each($(tweets), function(index, user_thumbnail, created_at, text, name, screen_name){
//   var $user_thumbnails = (tweets[index].user_thumbnail);
//   var $created_ats = (tweets[index].created_at);
//   var $texts = (tweets[index].text);
//   var $names = (tweets[index].name);
//   var $screen_names = (tweets[index].screen_name);
//   var tweetsToPush = '<li class="stream-item"><div class="tweet"><a href="#"><img src="'+$user_thumbnails+'"></a><div class="content"><strong class="fullname">'+$names+'</strong><span>&rlm;</span><span>@</span><b>'+$screen_names+'</b>&nbsp;&middot;&nbsp;<small class="time">'+$created_ats+'</small><p>'+$texts+'</p></div></div></li>';
//     $(".stream-items").append(tweetsToPush);
// })