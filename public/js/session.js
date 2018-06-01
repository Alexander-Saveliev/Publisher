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


session.on('streamCreated', (event) => {
    // Subscribe to the Stream to receive it
    // HTML video will be appended to element with 'video-container' id
    var subscriber = session.subscribe(event.stream, 'main-video');
});


session.connect(token, '{"clientData": "' + "abc" + '"}', function (error) {

  // If the connection is successful, initialize a publisher and publish to the session
  if (!error) {

    // Here we check somehow if the user has at least 'PUBLISHER' role before
    // trying to publish its stream. Even if someone modified the client's code and
    // published the stream, it wouldn't work if the token sent in Session.connect
    // method doesn't belong to a 'PUBLIHSER' role
    if (role == "publisher") {

      // --- 4) Get your own camera stream ---

      var publisher = OV.initPublisher('main-video', {
        audio: true,        // Whether you want to transmit audio or not
        video: false,        // Whether you want to transmit video or not
        audioActive: true,  // Whether you want to start the publishing with your audio unmuted or muted
        videoActive: true,  // Whether you want to start the publishing with your video enabled or disabled
        quality: 'MEDIUM',  // The quality of your video ('LOW', 'MEDIUM', 'HIGH')
        screen: true       // true to get your screen as video source instead of your camera
      });

      // When our HTML video has been added to DOM...
      publisher.on('videoElementCreated', function (event) {
        // Init the main video with ours and append our data
        var userData = {
          userName: userName
        };
        initMainVideo(event.element, userData);
        appendUserData(event.element, userData);
        $(event.element).prop('muted', true); // Mute local video
      });


      // --- 5) Publish your stream ---

      session.publish(publisher);

    } else {
      console.warn('You don\'t have permissions to publish');
      initMainVideoThumbnail(); // Show SUBSCRIBER message in main video
    }
  } else {
    console.warn('There was an error connecting to the session:', error.code, error.message);
  }
});
