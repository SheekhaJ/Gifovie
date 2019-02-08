var gifQueryType = "";
var key = "LHS9L8D4KLDF";
var tenorBaseUrl = "https://api.tenor.com/v1";
var searchTerm = "";


var fields = 'id,name,url';

$(document).ready(function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  $('#getStartedBtn').click(function () {
    gifQueryType = "trending";
    $('#addGifSection')[0].scrollIntoView(true);

    var url = tenorBaseUrl+"/anonid?key=" + key;

    httpGetAsync(url,tenorCallback_anonid);

    setTimeout(function () {
      $('#header').css('z-index', '1');
      $('#gifSearch, #gifSearchResults').css('z-index', '1');
    }, 600);
    $('#chosenGifsTitle').stop(true, false).animate({
      'opacity': '1'
    });
    $('.selected-gif').stop(true, false).animate({
      'opacity': '1'
    }, 600);
  });

  $('#header').click(function(){
    $('#welcomeSection')[0].scrollIntoView(true);
  })
  $('#gifSearch').click(function(){
    gifQueryType = "search";

    var url = tenorBaseUrl+"/anonid?key=" + key;
    searchTerm = document.getElementById('gifSearchInput').value;

    httpGetAsync(url,tenorCallback_anonid);

  });

  $('#clearSelectedGifsBtn').click(function() {
    console.log('clearing gifs');
    $('#selectedGif1').removeAttr('src');
    $('#selectedGif2').removeAttr('src');
    $('#selectedGif3').removeAttr('src');
    $('#selectedGif4').removeAttr('src');
    $('#selectedGif1').css('width', "15vw");
    $('#selectedGif2').css('width', "15vw");
    $('#selectedGif3').css('width', "15vw");
    $('#selectedGif4').css('width', "15vw");
    console.log($('#selectedGif1').attr('src'));
  });

  $('#goToAddSoundBtn').click(function () {
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#addSoundSection')[0].scrollIntoView(true);
    $('#gifSearch, #gifSearchResults').css('z-index', '-1');
    setTimeout(function () {
      $('#soundSearch, #soundSearchResults').css('z-index', '1');
      $('#chosenSoundsTitle').html('Sounds Go Here');
    }, 600);
    //console.log('about to go to review section');
    //if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    //$('#soundSearch, #soundSearchResults').css('z-index', '-1');
    console.log($('#chosenGifsArea').html());
    //$('#reviewGif').html($('#chosenGifs').html());
    $('#finalGif1').css('display', 'block');
    $('#finalGif2').css('display', 'block');
    $('#finalGif3').css('display', 'block');
    $('#finalGif4').css('display', 'block');
    $('#finalGif1').attr('src', $('#selectedGif1').attr('src'));
    $('#finalGif2').attr('src', $('#selectedGif2').attr('src'));
    $('#finalGif3').attr('src', $('#selectedGif3').attr('src'));
    $('#finalGif4').attr('src', $('#selectedGif4').attr('src'));
    if (typeof $('#finalGif1').attr('src') === typeof undefined || $('#finalGif1').attr('src') === false) $('#finalGif1').css('display', 'none');
    if (typeof $('#finalGif2').attr('src') === typeof undefined || $('#finalGif2').attr('src') === false) $('#finalGif2').css('display', 'none');
    if (typeof $('#finalGif3').attr('src') === typeof undefined || $('#finalGif3').attr('src') === false) $('#finalGif3').css('display', 'none');
    if (typeof $('#finalGif4').attr('src') === typeof undefined || $('#finalGif4').attr('src') === false) $('#finalGif4').css('display', 'none');
    //$('#reviewSection')[0].scrollIntoView(true);
    /*$('#progressBar').stop(true, false).animate({
      'opacity': '0'
    }, 200);
    setTimeout(function () {
      $('#progressBar').css('display', 'none');
    }, 200);*/
  });
  $('#backToWelcomeBtn').click(function () {
    if ($('#header').css('z-index') != '-1') $('#header').css('z-index', '-1');
    $('#gifSearch, #gifSearchResults').css('z-index', '-1');
    $('#welcomeSection')[0].scrollIntoView(true);
    $('#chosenGifsTitle').stop(true, false).animate({
      'opacity': '0'
    }, 600);
    $('.selected-gif').stop(true, false).animate({
      'opacity': '0'
    }, 600);
    setTimeout(function() {
      $('#selectedGif1').removeAttr('src');
      $('#selectedGif2').removeAttr('src');
      $('#selectedGif3').removeAttr('src');
      $('#selectedGif4').removeAttr('src');
      $('#selectedGif1').css('width', "15vw");
      $('#selectedGif2').css('width', "15vw");
      $('#selectedGif3').css('width', "15vw");
      $('#selectedGif4').css('width', "15vw");
    }, 600);
  });

  $('#soundSearchBtn').click(function() {
    searchForSounds($('#soundSearchInput').val());
  });

  $('#goToReviewBtn').click(function () {
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#soundSearch, #soundSearchResults').css('z-index', '-1');
    $('#reviewSection')[0].scrollIntoView(true);
    $('#progressBar').stop(true, false).animate({
      'opacity': '0'
    }, 200);
    setTimeout(function () {
      $('#progressBar').css('display', 'none');
    }, 200);
  });
  $('#backToAddGifBtn').click(function () {
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#soundSearch, #soundSearchResults').css('z-index', '-1');
    $('#addGifSection')[0].scrollIntoView(true);
    $('#progressBar').stop(true, false).animate({
      'margin-bottom': '-5vh'
    }, 600);
    setTimeout(function () {
      $('#chosenSoundsTitle').html('');
      $('#chosenGifs').css('border-bottom', 'solid transparent 1px');
    }, 600);
  });

  $('#downloadBtn').click(function () {
    /* Code to download GIFovie */
    $('#downloadBtn').removeClass('btn-primary');
    $('#downloadBtn').addClass('btn-success');
    $('#downloadBtn').html('Downloaded!');
    $('#downloadBtn').attr('disabled', 'disabled');
  });
  $('#backToAddSoundBtn').click(function () {
    /*if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#soundSearch, #soundSearchResults').css('z-index', '-1');
    $('#addSoundSection')[0].scrollIntoView(true);
    $('#progressBar').css('display', 'block');

    $('#progressBar').stop(true, false).animate({
      'opacity': '1'
    }, 200);*/
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#soundSearch, #soundSearchResults').css('z-index', '-1');
    $('#addGifSection')[0].scrollIntoView(true);
    $('#progressBar').css('display', 'block');

    $('#progressBar').stop(true, false).animate({
      'opacity': '1'
    }, 200);
  });

});

function httpGetAsync(theUrl, callback) {
  // create the request object
  var xmlHttp = new XMLHttpRequest();

  // set the state change callback to capture when the response comes in
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }
  }

  // open as a GET call, pass in the url and set async = True
  xmlHttp.open("GET", theUrl, true);

  // call send with no params as they were passed in on the url string
  xmlHttp.send(null);

  return;
}

// callback for trending top 10 GIFs
function tenorCallback_trending(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    var top_20_gifs = response_objects["results"];

    // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)
    for(i=1; i<=20; i++){
        //document.getElementById("gifSearchResult"+i).src = top_20_gifs[i-1]["media"][0]["nanogif"]["url"];
        document.getElementById("gifSearchResult"+i).src = top_20_gifs[i-1]["media"][0]["gif"]["url"];
    }

    return;

}

function tenorCallback_search(responseText, callback){
  // parse the json response
  var response_objects = JSON.parse(responseText);

  var top_20_gifs = response_objects["results"];

  // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)
  for(i=1;i<=20;i++){
    //document.getElementById("gifSearchResult"+i).src = top_20_gifs[i-1]["media"][0]["nanogif"]["url"];
    document.getElementById("gifSearchResult"+i).src = top_20_gifs[i-1]["media"][0]["gif"]["url"];
  }

  callback(searchTerm);

  return;
}

function setSearchDivText(){
  console.log('In setSearchDivText!')
  $('#search-term').html(['Search term: '+searchTerm]);
}

function grab_data(anon_id)
{

    var searchUrl = tenorBaseUrl + "/search?key=" + key;
    var trendingUrl = tenorBaseUrl + "/trending?key=" + key;
    var searchSuggestionsUrl = tenorBaseUrl + "/search_suggestions?key=" + key;
    var autocompleteUrl = tenorBaseUrl + "/autocomplete?key=" + key;

    // set the apikey and limit
    var lmt = 21;

    // get the top 10 trending GIFs (updated through out the day) - using the default locale of en_US
    var url = "";
    if (gifQueryType == "trending") {
      url = trendingUrl + "&limit=" + lmt + "&anon_id=" + anon_id;
      httpGetAsync(url, tenorCallback_trending);
    } else if (gifQueryType == "search"){
      url = searchUrl + "&limit=" + lmt + "&anon_id=" + anon_id + "&tag=" + searchTerm + "&media_filter=basic";
      httpGetAsync(url, tenorCallback_search);
    }

    console.log(gifQueryType+' url: '+url);
    // data will be loaded by each call's callback
    return;
}


// callback for anonymous id -- for first time users
function tenorCallback_anonid(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    anon_id = response_objects["anon_id"];
    // pass on to grab_data
    grab_data(anon_id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function dropGif(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log(document.getElementById(data).src);
  console.log(ev.target);
  ev.target.src = document.getElementById(data).src;
  ev.target.style.width = 'auto';
  /*if (('#chosenGif1').html() != '') {

  }*/
}

function submitGifovieForm(){
  return false;
}

function displayMessage(text,place){
  document.getElementById(place).innerHTML=text;
}

function displaySoundElement(soundObject){
  // console.log('First child of soundResult1 is '+document.getElementById("soundResult1").nextElementSibling);
  // console.log("sound name: "+soundObject.name);
  // console.log("sound url: "+soundObject.url);
  document.getElementById("soundResult1").src = soundObject.url+"download/"+soundObject.name+".wav";
  document.getElementById("soundResult1").nextElementSibling.innerHTML = soundObject.name;
}

function searchForSounds(query) {
  var page = 1;
  var filter = "duration:[2.0 TO 5.0] type:wav";
  var sort = "rating_desc";
  freesound.textSearch(query, { page: page, filter: filter, sort: sort, fields: fields },
    function (sounds) {
      // console.log('query: '+query);
      // console.log('filter: '+filter);
      // console.log('sort: '+sort);
      // console.log('sounds: '+sounds);
      for (i = 0; i <= 10; i++) {
        var snd = sounds.getSound(i);
        displaySoundElement(snd);
        // document.createElement()
      }
      //displayMessage(msg, "soundSearchResults")
      // displayMessage(msg, "soundResult6")
    }, function () { displayError("Error while searching...") }
  );
}
