$( "#leaveSession" ).click(function() { leaveSession() });
$( "#logout" ).click(function() { logout() });
$( "#send" ).click(function() { sendMessage() });
$( "#getID" ).click(function() { getID() });

var OV            = new OpenVidu();
var session       = OV.initSession(sessionID);
var messagesCount = 0;

function leaveSession() {
    session.disconnect();

    httpRequest('post', '/leave-session', JSON.stringify({ sessionID: sessionID, token: token }), 'logout error', function( data ) {
        window.location = "/home";
    });
};

session.on('streamCreated', function (event) {
    var subscriber = session.subscribe(event.stream, 'main-video');
});

session.on('signal', function(event) {
    var colorStyle = "self";

    if (event.from.data == user) {
        colorStyle = "";
    }
    if (messagesCount > 9) {
        $( "#messages" ).children().last().remove();
    } else {
        messagesCount++;
    }
    $( "#messages" ).prepend( `<p class="main-message ${colorStyle}">${event.from.data}:   ${event.data}</p>` );
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
    var message = $('#message-field').val();
    $('#message-field').val('');
    if (message == "") {
        return;
    }
    session.signal({
            data: message,
            to: []
        },
        function(error) {
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
