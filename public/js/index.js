$(document).ready(function() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  $('#getStartedBtn').click(function() {
    $('#addGifSection')[0].scrollIntoView(true);
    setTimeout(function() {
      $('#header').css('z-index', '1');
      $('#chosenGifsTitle').html('GIFs Go Here');
      $('#gifSearch, #gifSearchResults').css('z-index', '1');
    }, 600);
  });

  $('#goToAddSoundBtn').click(function() {
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#addSoundSection')[0].scrollIntoView(true);
    $('#gifSearch, #gifSearchResults').css('z-index', '-1');
    setTimeout(function() {
      $('#chosenGifs').css('border-bottom', 'solid #707070 1px');
      $('#soundSearch, #soundSearchResults').css('z-index', '1');
      $('#chosenSoundsTitle').html('Sounds Go Here');
    }, 600);
    $('#progressBar').stop(true, false).animate({
      'margin-bottom': '0vh'
    }, 600);
  });
  $('#backToWelcomeBtn').click(function() {
    if ($('#header').css('z-index') != '-1') $('#header').css('z-index', '-1');
    $('#gifSearch, #gifSearchResults').css('z-index', '-1');
    $('#welcomeSection')[0].scrollIntoView(true);
    $('#chosenGifsTitle').html('');
  });

  $('#goToReviewBtn').click(function() {
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#soundSearch, #soundSearchResults').css('z-index', '-1');
    $('#reviewSection')[0].scrollIntoView(true);
    $('#progressBar').stop(true, false).animate({
      'opacity': '0'
    }, 200);
    setTimeout(function() {
      $('#progressBar').css('display', 'none');
    }, 200);
  });
  $('#backToAddGifBtn').click(function() {
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#soundSearch, #soundSearchResults').css('z-index', '-1');
    $('#addGifSection')[0].scrollIntoView(true);
    $('#progressBar').stop(true, false).animate({
      'margin-bottom': '-5vh'
    }, 600);
    setTimeout(function() {
      $('#chosenSoundsTitle').html('');
      $('#chosenGifs').css('border-bottom', 'solid transparent 1px');
    }, 600);
  });

  $('#downloadBtn').click(function() {
    /* Code to download GIFovie */
    $('#downloadBtn').removeClass('btn-primary');
    $('#downloadBtn').addClass('btn-success');
    $('#downloadBtn').html('Downloaded!');
    $('#downloadBtn').attr('disabled', 'disabled');
  });
  $('#backToAddSoundBtn').click(function() {
    if ($('#header').css('z-index') != '1') $('#header').css('z-index', '1');
    $('#soundSearch, #soundSearchResults').css('z-index', '-1');
    $('#addSoundSection')[0].scrollIntoView(true);
    $('#progressBar').css('display', 'block');

    $('#progressBar').stop(true, false).animate({
      'opacity': '1'
    }, 200);
  });

});
