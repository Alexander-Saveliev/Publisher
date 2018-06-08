$( "#leaveSession" ).click(function() { leaveSession() });
$( "#logout" ).click(function() { logout() });
$( "#send" ).click(function() { sendMessage() });
$( "#getID" ).click(function() { getID() });


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

session.on('signal', function(event) {
    var colorStyle = "self";

    if (event.from.data == user) {
        colorStyle = "";
    }

    $( "#messages" ).append( `<p class="main-message ${colorStyle}">${event.from.data}:   ${event.data}</p>` );
});

session.connect(token, '', function (error) {
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

function sendMessage() {
    session.signal({
            data: $('#message-field').val(),
            to: []
        },
        function(error) {
            $("#message-field").val('');

            if (!error) {
                console.log("Message was send successfully");
            } else {
                console.warn("Error with senging message: " + error);
            }
        });
}

function getID() {
    alert(sessionID);
}
