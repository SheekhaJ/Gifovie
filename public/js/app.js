var gifQueryType = "";
var key = "LHS9L8D4KLDF";
var tenorBaseUrl = "https://api.tenor.com/v1";
var searchTerm = "";

var selectedGIFURLs = new Map();
var selectedSoundURLs = {};
var fields = 'id,name,url';

$(document).ready(function () {
  //document.body.scrollTop = 0;
  //document.documentElement.scrollTop = 0;
  console.log(location.pathname);
  if (location.pathname == '/addGIFs') {
    $('.cover').css('display', 'flex');
    gifQueryType = "trending";
    var url = tenorBaseUrl+"/anonid?key=" + key;
    httpGetAsync(url,tenorCallback_anonid);
  }
  if (location.pathname == '/reviewGIFovie') {
    $('#download1Btn, #download2Btn, #download3Btn, #download4Btn').css('display', 'none');
    setTimeout(function() {
      $('#gifovieVideo1').attr('src', '/public/media/gifovie0.mp4');
      $('#gifovieVideo2').attr('src', '/public/media/gifovie1.mp4');
      $('#gifovieVideo3').attr('src', '/public/media/gifovie2.mp4');
      $('#gifovieVideo4').attr('src', '/public/media/gifovie3.mp4');
      console.log($('#gifovieVideo1').attr('src'));
      console.log($('#gifovieVideo2').attr('src'));
      console.log($('#gifovieVideo3').attr('src'));
      console.log($('#gifovieVideo4').attr('src'));
      $.get('/public/media/gifovie0.mp4', function(data, textStatus) {
        if (textStatus == "success") {
            // execute a success code
            $('#loadingIndicator').css('display', 'none');
            $('#download1Btn').css('display', 'inline-block');
        }
      });
      $.get('/public/media/gifovie1.mp4', function(data, textStatus) {
        if (textStatus == "success") {
            // execute a success code
            $('#loadingIndicator').css('display', 'none');
            $('#download2Btn').css('display', 'inline-block');
        }
      });
      $.get('/public/media/gifovie2.mp4', function(data, textStatus) {
        if (textStatus == "success") {
            // execute a success code
            $('#loadingIndicator').css('display', 'none');
            $('#download3Btn').css('display', 'inline-block');
        }
      });
      $.get('/public/media/gifovie3.mp4', function(data, textStatus) {
        if (textStatus == "success") {
            // execute a success code
            $('#loadingIndicator').css('display', 'none');
            $('#download4Btn').css('display', 'inline-block');
        }
      });
    }, 5000);
  }
  $('.close').css('display', 'none');
  $('#selectedGif1').css('opacity', '0');
  $('#selectedGif2').css('opacity', '0');
  $('#selectedGif3').css('opacity', '0');
  $('#selectedGif4').css('opacity', '0');
  if (sessionStorage.getItem('gif1') != null && sessionStorage.getItem('gif1') != '#') {
    $('#selectedGif1').attr('src', sessionStorage.getItem('gif1'));
    $('#selectedGif1').css('width', 'auto');
    $('#selectedGif1').css('opacity', '1');
    $('button[data-id="Gif1"]').css('display', 'block');
  }
  if (sessionStorage.getItem('gif2') != null && sessionStorage.getItem('gif2') != '#') {
    $('#selectedGif2').attr('src', sessionStorage.getItem('gif2'));
    $('#selectedGif2').css('width', 'auto');
    $('#selectedGif2').css('opacity', '1');
    $('button[data-id="Gif2"]').css('display', 'block');
  }
  if (sessionStorage.getItem('gif3') != null && sessionStorage.getItem('gif3') != '#') {
    $('#selectedGif3').attr('src', sessionStorage.getItem('gif3'));
    $('#selectedGif3').css('width', 'auto');
    $('#selectedGif3').css('opacity', '1');
    $('button[data-id="Gif3"]').css('display', 'block');
  }
  if (sessionStorage.getItem('gif4') != null && sessionStorage.getItem('gif4') != '#') {
    $('#selectedGif4').attr('src', sessionStorage.getItem('gif4'));
    $('#selectedGif4').css('width', 'auto');
    $('#selectedGif4').css('opacity', '1');
    $('button[data-id="Gif4"]').css('display', 'block');
  }
  if (sessionStorage.getItem('sound1') != null) {
    var url = sessionStorage.getItem('sound1');
    var urlPieces = url.split('/');
    var soundNameToShow = urlPieces[urlPieces.length-1].split('?')[0];
    $('#selectedSound1').html((soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow);
    $('button[data-id="Sound1"]').css('display', 'block');
  }
  if (sessionStorage.getItem('sound2') != null) {
    var url = sessionStorage.getItem('sound2');
    var urlPieces = url.split('/');
    var soundNameToShow = urlPieces[urlPieces.length-1].split('?')[0];
    $('#selectedSound2').html((soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow);
    $('button[data-id="Sound2"]').css('display', 'block');
  }
  if (sessionStorage.getItem('sound3') != null) {
    var url = sessionStorage.getItem('sound3');
    var urlPieces = url.split('/');
    var soundNameToShow = urlPieces[urlPieces.length-1].split('?')[0];
    $('#selectedSound3').html((soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow);
    $('button[data-id="Sound3"]').css('display', 'block');
  }
  if (sessionStorage.getItem('sound4') != null) {
    var url = sessionStorage.getItem('sound4');
    var urlPieces = url.split('/');
    var soundNameToShow = urlPieces[urlPieces.length-1].split('?')[0];
    $('#selectedSound4').html((soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow);
    $('button[data-id="Sound4"]').css('display', 'block');
  }
  if (sessionStorage.getItem('fullURLSound1') != null) $('#selectedSoundA1').attr('href', sessionStorage.getItem('fullURLSound1'));
  if (sessionStorage.getItem('fullURLSound2') != null) $('#selectedSoundA2').attr('href', sessionStorage.getItem('fullURLSound2'));
  if (sessionStorage.getItem('fullURLSound3') != null) $('#selectedSoundA3').attr('href', sessionStorage.getItem('fullURLSound3'));
  if (sessionStorage.getItem('fullURLSound4') != null) $('#selectedSoundA4').attr('href', sessionStorage.getItem('fullURLSound4'));

  $('#getStartedBtn').click(function () {
    location = '/addGIFs';
  });

  $('#header').click(function(){
    location = '/';
  });

  $('#gifSearchBtn').click(function(){
    $('.cover').css('display', 'flex');
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
    // console.log("clicked go to sound button");
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

      var gif1 = document.getElementById('selectedGif1').src == "http://localhost:3000/addSounds#" ? null : document.getElementById('selectedGif1').src;
      var gif2 = document.getElementById('selectedGif2').src == "http://localhost:3000/addSounds#" ? null : document.getElementById('selectedGif2').src;
      var gif3 = document.getElementById('selectedGif3').src == "http://localhost:3000/addSounds#" ? null : document.getElementById('selectedGif3').src;
      var gif4 = document.getElementById('selectedGif4').src == "http://localhost:3000/addSounds#" ? null : document.getElementById('selectedGif4').src;

      var selectedGIFURLs = gif1+"_"+gif2+"_"+gif3+"_"+gif4;
      console.log("selectedGIFs:= "+selectedGIFURLs);

      // var sound1 = document.getElementById('selectedSoundA1').href != null ? null : document.getElementById('selectedSoundA1').href;
      var sound1 = document.getElementById('selectedSoundA1').href != "" ? document.getElementById('selectedSoundA1').href : null;
      var sound2 = document.getElementById('selectedSoundA2').href != "" ? document.getElementById('selectedSoundA2').href : null;
      var sound3 = document.getElementById('selectedSoundA3').href != "" ? document.getElementById('selectedSoundA3').href : null;
      var sound4 = document.getElementById('selectedSoundA4').href != "" ? document.getElementById('selectedSoundA4').href : null;

      var selectedSoundURLs = sound1+"_"+sound2+"_"+sound3+"_"+sound4;
      console.log('Sound1: '+sound1);
      console.log('Sound2: '+sound2);
      console.log('Sound3: '+sound3);
      console.log('Sound4: '+sound4);
      console.log("selectedSounds:= "+selectedSoundURLs);

      document.cookie = "gifURLs="+selectedGIFURLs;
      document.cookie = "soundURLs="+selectedSoundURLs;

      location = '/reviewGIFovie';
  });
  $('#backToAddGifBtn').click(function () {
    location = '/addGIFs';
  });

  $('#download1Btn').click(function () {
    $('#download1Btn').removeClass('btn-primary');
    $('#download1Btn').addClass('btn-success');
    $('#download1Btn').html('Downloaded!');
    $('#download1Btn').attr('disabled', 'disabled');
  });
  $('#download2Btn').click(function () {
    $('#download2Btn').removeClass('btn-primary');
    $('#download2Btn').addClass('btn-success');
    $('#download2Btn').html('Downloaded!');
    $('#download2Btn').attr('disabled', 'disabled');
  });
  $('#download3Btn').click(function () {
    $('#download3Btn').removeClass('btn-primary');
    $('#download3Btn').addClass('btn-success');
    $('#download3Btn').html('Downloaded!');
    $('#download3Btn').attr('disabled', 'disabled');
  });
  $('#download4Btn').click(function () {
    $('#download4Btn').removeClass('btn-primary');
    $('#download4Btn').addClass('btn-success');
    $('#download4Btn').html('Downloaded!');
    $('#download4Btn').attr('disabled', 'disabled');
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
      $('#selected' + data_id).css('opacity', '0');
      sessionStorage.removeItem('gif'+data_id[data_id.length-1]);
    }
    $(this).css('display', 'none');
  });

});

  function getSounds(category){
    console.log('category is '+category);

    location = "/addSounds?category="+category;
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

    var top_21_gifs = response_objects["results"];

    // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)
    for(i=1; i<=21; i++){
        //document.getElementById("gifSearchResult"+i).src = top_20_gifs[i-1]["media"][0]["nanogif"]["url"];
        document.getElementById("gifSearchResult"+i).src = top_21_gifs[i-1]["media"][0]["gif"]["url"];
    }
    $('.cover').css('display', 'none');

    return;

}

function tenorCallback_search(responseText, callback){
  // parse the json response
  var response_objects = JSON.parse(responseText);

  var top_21_gifs = response_objects["results"];

  // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)
  for(i=1;i<=21;i++){
    //document.getElementById("gifSearchResult"+i).src = top_20_gifs[i-1]["media"][0]["nanogif"]["url"];
    document.getElementById("gifSearchResult"+i).src = top_21_gifs[i-1]["media"][0]["gif"]["url"];
  }
  $('.cover').css('display', 'none');

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
  console.log("in drag function: "+ev.target.id);
}

function drop(ev) {
  console.log("in drop!");
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log('Selected element identifier is '+data);
  console.log('src of selected element identifier is '+document.getElementById(data).src);
  // console.log('ev.target: '+ev.target);
  console.log('target.id: '+ev.target.id);

  if (document.getElementById(data).src.includes('.gif') && ev.target.id.includes('Gif')) {
    //ev.target.src = document.getElementById(data).src;
    console.log(ev.target.src);
    console.log(ev.target.id);
    sessionStorage.setItem('gif'+ev.target.id[ev.target.id.length-1], document.getElementById(data).src);
    $('#selectedGif'+ev.target.id[ev.target.id.length-1]).attr('src', document.getElementById(data).src);
    $('#selectedGif'+ev.target.id[ev.target.id.length-1]).css('opacity', '1');
    $('#selectedGif'+ev.target.id[ev.target.id.length-1]).css('width', 'auto');
    $('button[data-id="Gif'+ev.target.id[ev.target.id.length-1]+'"]').css('display', 'block');
  }
  else if (document.getElementById(data).src.includes('.wav') && ev.target.id.includes('Sound')) {
    console.log('inside second block!');
    var url = document.getElementById(data).src;
    urlPieces = url.split('/');

    var category = urlPieces[4];
    var soundNameToShow = url.substring(url.indexOf(category)+category.length+1,url.indexOf("?"));
    soundNameToShow = soundNameToShow.includes(".wav") ? soundNameToShow.replace(".wav","") : soundNameToShow;

    ev.target.innerHTML = (soundNameToShow.length > 20) ? soundNameToShow.substring(0,17)+'...' : soundNameToShow;
    console.log(ev.target.id[ev.target.id.length-1]);
    console.log($('button[data-id="Sound'+ev.target.id[ev.target.id.length-1]+'"]').css('display'));
    $('button[data-id="Sound'+ev.target.id[ev.target.id.length-1]+'"]').css('display', 'block');

    sessionStorage.setItem('sound'+ev.target.id[ev.target.id.length-1], soundNameToShow);
    $('a[id="selectedSoundA'+ev.target.id[ev.target.id.length-1]+'"]').attr('href', url);
    console.log('new element: '+$('a[id="selectedSoundA'+ev.target.id[ev.target.id.length-1]+'"]').attr('href'));
    sessionStorage.setItem('fullURLSound'+ev.target.id[ev.target.id.length-1], url);
  }
  console.log('sessionStorage: '+typeof(sessionStorage));
}

function submitGifovieForm(){
  return false;
}

// function sendSelectedItemUrls(){
//   for(var i=0; i<4; i++){
//     selectedGIFURLs.push(document.getElementById('selectedGif'+(i+1)).src);
//     selectedSoundURLs.push('../hahaha.wav');
//   }
//   var data = [selectedGIFURLs, selectedSoundURLs];

//   url = "http://localhost:3000?data="+data;

//   var xmlHttp = new XMLHttpRequest();
//   xmlHttp.open('POST',url);
//   xmlHttp.send(data);
//   return;
// }
