var gifQueryType = "";
var key = "LHS9L8D4KLDF";
var tenorBaseUrl = "https://api.tenor.com/v1";
var searchTerm = "";

var selectedGIFURLs = [];
var selectedSoundURLs = [];
var fields = 'id,name,url';
var soundNames = [];

$(document).ready(function () {
  //document.body.scrollTop = 0;
  //document.documentElement.scrollTop = 0;
  console.log(location.pathname);
  if (location.pathname == '/addGIFs') {
    gifQueryType = "trending";
    var url = tenorBaseUrl+"/anonid?key=" + key;
    httpGetAsync(url,tenorCallback_anonid);
  }
  else if (location.pathname == '/addSounds') {

  }
  if (sessionStorage.getItem('sound1') != null) {
    var url = sessionStorage.getItem('sound1');
    var urlPieces = url.split('/');
    var soundNameToShow = urlPieces[urlPieces.length-2] + '/' + urlPieces[urlPieces.length-1].split('?')[0];
    $('#selectedSound1').html((soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow);
  }
  if (sessionStorage.getItem('sound2') != null) {
    var url = sessionStorage.getItem('sound2');
    var urlPieces = url.split('/');
    var soundNameToShow = urlPieces[urlPieces.length-2] + '/' + urlPieces[urlPieces.length-1].split('?')[0];
    $('#selectedSound2').html((soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow);
  }
  if (sessionStorage.getItem('sound3') != null) {
    var url = sessionStorage.getItem('sound3');
    var urlPieces = url.split('/');
    var soundNameToShow = urlPieces[urlPieces.length-2] + '/' + urlPieces[urlPieces.length-1].split('?')[0];
    $('#selectedSound3').html((soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow);
  }
  if (sessionStorage.getItem('sound4') != null) {
    var url = sessionStorage.getItem('sound4');
    var urlPieces = url.split('/');
    var soundNameToShow = urlPieces[urlPieces.length-2] + '/' + urlPieces[urlPieces.length-1].split('?')[0];
    $('#selectedSound4').html((soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow);
  }

  $('#getStartedBtn').click(function () {
    location = '/addGIFs';
  });

  $('#header').click(function(){
    location = '/';
  });

  $('#gifSearchBtn').click(function(){
    for (i = 1; i <= 21; i++) {
      $('#gifSearchResult'+i).removeAttr('src');
    }
    gifQueryType = "search";

    var url = tenorBaseUrl+"/anonid?key=" + key;
    searchTerm = document.getElementById('gifSearchInput').value;

    httpGetAsync(url,tenorCallback_anonid);

  });

  $('#refreshGifsBtn').click(function() {
    for (i = 1; i <= 21; i++) {
      $('#gifSearchResult'+i).removeAttr('src');
    }

    var url = tenorBaseUrl+"/anonid?key=" + key;
    httpGetAsync(url,tenorCallback_anonid);
  });

  $('#goToAddSoundBtn').click(function () {
    console.log("clicked go to sound button");
    sessionStorage.setItem('gif1', $('#selectedGif1').attr('src'));
    sessionStorage.setItem('gif2', $('#selectedGif2').attr('src'));
    sessionStorage.setItem('gif3', $('#selectedGif3').attr('src'));
    sessionStorage.setItem('gif4', $('#selectedGif4').attr('src'));
    location = '/addSounds';
  });
  $('#backToWelcomeBtn').click(function () {
    sessionStorage.clear();
    location = '/';
  });

  $('#refreshSoundsBtn').click(function() {
    location = '/addSounds';
  });

  $('#goToReviewBtn').click(function () {
    /*sessionStorage.setItem('sound1', $('#selectedSound1'.html()));
    sessionStorage.setItem('sound2', $('#selectedSound2'.html()));
    sessionStorage.setItem('sound3', $('#selectedSound3'.html()));
    sessionStorage.setItem('sound4', $('#selectedSound4'.html()));*/
    location = '/reviewGIFovie';
  });
  $('#backToAddGifBtn').click(function () {
    location = '/addGIFs';
  });

  $('#downloadBtn').click(function () {
    /* Code to download GIFovie */
    $('#downloadBtn').removeClass('btn-primary');
    $('#downloadBtn').addClass('btn-success');
    $('#downloadBtn').html('Downloaded!');
    $('#downloadBtn').attr('disabled', 'disabled');
  });
  $('#backToAddSoundBtn').click(function () {
    location = '/addSounds';
  });

  $('.close').click(function() {
    var data_id = $(this).data('id');
    console.log(data_id);
    if (data_id.includes('Sound')) {
      $('#selected' + data_id).html('');
      sessionStorage.removeItem('sound'+data_id[data_id.length-1]);
    }
    else if (data_id.includes('Gif')) {
      $('#selected' + data_id).removeAttr('src');
    }
  });

});

  function getSounds(category){
    console.log('category is '+category);
    // var xmlHttp = new XMLHttpRequest();
    // url = "http://localhost:3000?category="+category;
    // xmlHttp.open('GET', url, true);
    // xmlHttp.send(null);

    location = "/addSounds?category="+category;

    // var s = <%= sounds %>;
    // document.getElementById('soundResult1').src = "<%= sounds.sounds[0] %>";

    return;
  }

function httpGetAsync(theUrl, callback) {
  // create the request object
  var xmlHttp = new XMLHttpRequest();

  // set the state change callback to capture when the response comes in
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }
  };

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
  $('#searchTerm').html('Search Results for "'+searchTerm+'"');

  callback(searchTerm);

  return;
}

function setSearchDivText(){
  console.log('In setSearchDivText!');
  $('#search-term').html(['Search term: '+searchTerm]);
}

function grab_data(anon_id)
{

    var searchUrl = tenorBaseUrl + "/search?key=" + key;
    var trendingUrl = tenorBaseUrl + "/trending?key=" + key;
    var searchSuggestionsUrl = tenorBaseUrl + "/search_suggestions?key=" + key;
    var autocompleteUrl = tenorBaseUrl + "/autocomplete?key=" + key;

    // set the apikey and limit
    var lmt = 20;

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
  console.log(ev.target.id);
}

function drop(ev) {
  console.log("dropped!");
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log(data);
  console.log(document.getElementById(data).src);
  //console.log(ev.target.id);
  if (document.getElementById(data).src.includes('.gif') && ev.target.id.includes('Gif')) {
    ev.target.src = document.getElementById(data).src;
    ev.target.style.width = 'auto';
    sessionStorage.setItem('gif'+ev.target.id[ev.target.id.length-1], document.getElementById(data).src);
  }
  else if (document.getElementById(data).src.includes('.wav') && ev.target.id.includes('Sound')) {
    urlPieces = document.getElementById(data).src.split('/');
    console.log(ev.target.src);
    console.log(ev.target.id);
    console.log(urlPieces);
    var soundNameToShow = urlPieces[urlPieces.length-2] + '/' + urlPieces[urlPieces.length-1].split('?')[0];
    ev.target.firstElementChild.innerHTML = (soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow;
    sessionStorage.setItem('sound'+ev.target.id[ev.target.id.length-1], document.getElementById(data).src);
    //console.log("here");
  }
  /*if (('#chosenGif1').html() != '') {

  }*/
}

function submitGifovieForm(){
  return false;
}

function sendSelectedItemUrls(){
  for(var i=0; i<4; i++){
    selectedGIFURLs.push(document.getElementById('selectedGif'+(i+1)).src);
    selectedSoundURLs.push('../hahaha.wav');
  }
  var data = [selectedGIFURLs, selectedSoundURLs];

  url = "http://localhost:3000?data="+data;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('POST',url);
  xmlHttp.send(data);
  return;
}

// function displaySoundCategories(){
//   var xmlHttp = new XMLHttpRequest();

//   xmlHttp.onreadystatechange = function () {
//     if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//       callback(xmlHttp.responseText);
//     }
//   }

//   // open as a GET call, pass in the url and set async = True
//   xmlHttp.open("POST", 'http://ec2-3-86-146-50.compute-1.amazonaws.com', true);

//   // call send with no params as they were passed in on the url string
//   xmlHttp.send(null);
// }

// function displayMessage(text,place){
//   document.getElementById(place).innerHTML=text;
// }

// function displaySoundElement(soundObject, i){
//   // console.log('First child of soundResult1 is '+document.getElementById("soundResult1").nextElementSibling);
//   // console.log("sound name: "+soundObject.name);
//   // console.log("sound url: "+soundObject.url);
//   soundNames.push(soundObject.url+"download/"+soundObject.name+".wav");

//   var loginURL = freesound.getLoginURL();
//   console.log('loginURL: '+loginURL);

//   // console.log('Download URL: '+soundObject.download(document.getElementById("soundResultiFrame"+i)));
//   // document.getElementById("soundResultiFrame"+i).setAttribute('hidden', 'false');
//   // document.getElementById("soundResult"+i).src = soundObject.download(document.getElementById("soundResultiFrame"+i));
//   snd = new Audio(soundObject);
//   console.log('snd: '+snd)

//   // document.getElementById("soundResult"+i).src = soundObject.url+"download/"+soundObject.name+".wav";
//   document.getElementById("soundResult"+i).nextElementSibling.innerHTML = soundObject.name;
// }

// function searchForSounds(query) {
//   var page = 1;
//   var filter = "duration:[2.0 TO 5.0] type:wav";
//   var sort = "rating_desc";
//   freesound.textSearch(query, { page: page, filter: filter, sort: sort, fields: fields },
//     function (sounds) {
//       // console.log('query: '+query);
//       // console.log('filter: '+filter);
//       // console.log('sort: '+sort);
//       // console.log('sounds: '+sounds);
//       for (i = 0; i < 9; i++) {
//         var snd = sounds.getSound(i);
//         console.log(snd);
//         displaySoundElement(snd.previews['preview-hq-mp3'], i+1);
//         // document.createElement()
//       }
//       //displayMessage(msg, "soundSearchResults")
//       // displayMessage(msg, "soundResult6")
//     }, function () { displayError("Error while searching...") }
//   );
// }
