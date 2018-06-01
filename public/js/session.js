$( "#leaveSession" ).click(function() { leaveSession() });
$( "#logout" ).click(function() { logout() });



$('form').submit(function(e) {
    $('#send').hide();
    $('#login_message').html('<img src="img/loading.gif" alt="">');

    var $form = $(this);
    $.ajax({
      type: $form.attr('method'),
      url: $form.attr('action'),
      data: $form.serialize()
    }).done(function() {
      window.location = "/";
    }).fail(function( data ) {
      $('#send').show();
      $('#login_message').text(data.responseText);
    });
    // отмена действия по умолчанию для кнопки submit
    e.preventDefault();
});



function leaveSession() {
    session.disconnect();

    httpRequest('post', '/leave-session', JSON.stringify({ sessionID: sessionID, token: token }), 'logout error', function( data ) {
        window.location = "/home";
    });
};


var OV = new OpenVidu();
var session = OV.initSession(sessionID);


session.on('streamCreated', function (event) {
    var subscriber = session.subscribe(event.stream, 'main-video');
});

session.connect(token, '{"clientData": "' + "abc" + '"}', function (error) {
  if (!error) {
    if (role == "publisher") {
      var publisher = OV.initPublisher('main-video', {
        audio: true,
        video: true,
        audioActive: true,
        videoActive: true,
        quality: 'MEDIUM',
        screen: true
      });

      publisher.on('videoElementCreated', function (event) {
          $(event.element).prop('muted', true); // Mute local video
      });
      
      session.publish(publisher);
    } else {
      console.warn('You don\'t have permissions to publish');
    }
  } else {
    console.warn('There was an error connecting to the session:', error.code, error.message);
  }
});
