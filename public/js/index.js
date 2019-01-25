$(document).ready(function() {
  $('#getStartedBtn').click(function() {
    /*$('body').animate({
      'scrollTop': $('#addGifSection').position().top
    });*/
    $('#addGifSection')[0].scrollIntoView(true);
    setTimeout(function() {
      $('#header').css('display', 'block');
    }, 600);
  });
});
