$(document).ready(function() {
  $('#welcomeSection')[0].scrollIntoView(true);

  $('#getStartedBtn').click(function() {
    $('#addGifSection')[0].scrollIntoView(true);
    setTimeout(function() {
      $('#header').css('z-index', '1');
    }, 600);

  });

  $('#goToAddSoundBtn').click(function() {
    $('#addSoundSection')[0].scrollIntoView(true);
  });
  $('#backToWelcomeBtn').click(function() {
    $('#header').css('z-index', '-1');
    $('#welcomeSection')[0].scrollIntoView(true);
  });

  $('#goToReviewBtn').click(function() {
    $('#reviewSection')[0].scrollIntoView(true);
  });
  $('#backToAddGifBtn').click(function() {
    $('#addGifSection')[0].scrollIntoView(true);
  });

  $('#downloadBtn').click(function() {
    $('#downloadSuccessModal').modal('show');
    setTimeout(function() {
      $('#downloadSuccessModal').modal('hide');
    }, 2000);
  });
  $('#backToAddSoundBtn').click(function() {
    $('#addSoundSection')[0].scrollIntoView(true);
  });

});
