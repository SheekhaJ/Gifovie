var gifQueryType = "";
var key = "LHS9L8D4KLDF";
var tenorBaseUrl = "https://api.tenor.com/v1";

$(document).ready(function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  $('#getStartedBtn').click(function () {
    gifQueryType = "trending";
    $('#addGifSection')[0].scrollIntoView(true);

    var url = tenorBaseUrl+"/anonid?key=" + key;

    // httpGetAsync(trendingUrl, tenorCallback_trending);
    httpGetAsync(url,tenorCallback_anonid);

    setTimeout(function () {
      $('#header').css('z-index', '1');
      $('#chosenGifsTitle').html('GIFs Go Here');
      $('#gifSearch, #gifSearchResults').css('z-index', '1');
    }, 600);
  });

  $('#gifSearch').click(function(){
    gifQueryType = "search";

    var url = tenorBaseUrl+"/anonid?key=" + key;

    httpGetAsync(url,tenorCallback_anonid);
  });

  $('#goToAddSoundBtn').click(function () {
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#addSoundSection')[0].scrollIntoView(true);
    $('#gifSearch, #gifSearchResults').css('z-index', '-1');
    setTimeout(function () {
      $('#chosenGifs').css('border-bottom', 'solid #707070 1px');
      $('#soundSearch, #soundSearchResults').css('z-index', '1');
      $('#chosenSoundsTitle').html('Sounds Go Here');
    }, 600);
    $('#progressBar').stop(true, false).animate({
      'margin-bottom': '0vh'
    }, 600);
  });
  $('#backToWelcomeBtn').click(function () {
    if ($('#header').css('z-index') != '-1') $('#header').css('z-index', '-1');
    $('#gifSearch, #gifSearchResults').css('z-index', '-1');
    $('#welcomeSection')[0].scrollIntoView(true);
    $('#chosenGifsTitle').html('');
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
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#soundSearch, #soundSearchResults').css('z-index', '-1');
    $('#addSoundSection')[0].scrollIntoView(true);
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
    console.log("In tenorcallback_trending");
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    var top_21_gifs = response_objects["results"];

    // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)
    // console.log("response text: " + responsetext);
    for(i=1; i<=21; i++){
        //document.getElementById("gifSearchResult"+i).src = top_21_gifs[i-1]["media"][0]["nanogif"]["url"];
        document.getElementById("gifSearchResult"+i).src = top_21_gifs[i-1]["media"][0]["tinygif"]["url"];
    }

    //document.getElementById("share_gif").src = top_10_gifs[0]["media"][0]["tinygif"]["url"];
    return;

}

function tenorCallback_search(responseText){
  console.log("In tenorcallback_search");
  // parse the json response
  var response_objects = JSON.parse(responseText);

  var top_21_gifs = response_objects["results"];

  // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)

  for(i=1;i<=21;i++){
    document.getElementById("gifSearchResult"+i).src = top_21_gifs[i-1]["media"][0]["tinygif"]["url"];
  }
  //document.getElementById("preview_gif").src = top_21_gifs[0]["media"][0]["nanogif"]["url"];

  return;
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
      console.log('url: ' + url);
      httpGetAsync(url, tenorCallback_trending);
    } else if (gifQueryType == "search"){
      url = searchUrl + "&limit=" + lmt + "&anon_id=" + anon_id;
      httpGetAsync(url, tenorCallback_search);
    }

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
