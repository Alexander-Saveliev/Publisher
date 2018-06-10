var OpenVidu = require('openvidu-node-client').OpenVidu;
var Session = require('openvidu-node-client').Session;
var OpenViduRole = require('openvidu-node-client').OpenViduRole;
var TokenOptions = require('openvidu-node-client').TokenOptions;

// Environment variable: URL where our OpenVidu server is listening
var OPENVIDU_URL = process.argv[2];
// Environment variable: secret shared with our OpenVidu server
var OPENVIDU_SECRET = process.argv[3];
// Entrypoint to OpenVidu Node Client SDK
var OV = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
// Collection to pair session ids with OpenVidu Session objects
var mapSessions = {};
// Collection to pair session ids with tokens
var mapSessionIDsTokens = {};

exports.createSession = function(req, res) {
    if (!req.session.loggedUser) {
        return res.status(400).send("Unauthorized");
    }

    var role       = OpenViduRole.PUBLISHER
    var serverData = req.session.loggedUser;
    // Build tokenOptions object with the serverData and the role
    var tokenOptions = {
        data: serverData,
        role: role
    };
    // Create a new OpenVidu Session asynchronously
    OV.createSession()
        .then(session => {
            // Store the new Session in the collection of Sessions
            mapSessions[session.sessionId] = session;
            // Store a new empty array in the collection of tokens
            mapSessionIDsTokens[session.sessionId] = [];
            // Generate a new token asynchronously with the recently created tokenOptions
            session.generateToken(tokenOptions)
                .then(token => {
                    // Store the new token in the collection of tokens
                    mapSessionIDsTokens[session.sessionId].push(token);
                    // Return session template with all the needed attributes
                    return res.render('session.ejs', {
                        sessionID: session.sessionId,
                        token: token,
                        user: req.session.loggedUser,
                        role: "publisher"
                    });
                })
                .catch(error => {
                    console.error(error);
                    return status(500).send();
                });
        })
        .catch(error => {
            console.error(error);
            return status(500).send();
        });
}

exports.joinSession = function(req, res) {
    if (!req.session.loggedUser) {
        return res.status(401).send("Unauthorized");
    }

    var sessionID = req.body.sessionIDName;
    if (!sessionID) {
        return res.status(400).send("SessionID is empty");
    }

    var session = mapSessions[sessionID];
    if (!session) {
        return res.status(400).send("Session with this ID doesn't exist");
    }

    var role = OpenViduRole.SUBSCRIBER;
    var serverData = req.session.loggedUser;

    var tokenOptions = {
        data: serverData,
        role: role
    };

    session.generateToken(tokenOptions)
        .then(token => {
            // Store the new token in the collection of tokens
            mapSessionIDsTokens[sessionID].push(token);
            // Return session template with all the needed attributes
            return res.render('session.ejs', {
                sessionID: session.sessionId,
                token: token,
                user: req.session.loggedUser,
                role: "subscriber"
            });
        })
        .catch(error => {
            return status(500).send();
            console.error(error);
        });
}

exports.leaveSession = function(req, res) {
    if (!req.session.loggedUser) {
        req.session.destroy();
        res.status(401).send();
    } else {
        // Retrieve params from POST body
        var sessionID = req.body.sessionID;
        var token     = req.body.token;
        console.log('Removing user | {sessionID, token}={' + sessionID + ', ' + token + '}');
        // If the session exists
        if (mapSessions[sessionID] && mapSessionIDsTokens[sessionID]) {
            var tokens = mapSessionIDsTokens[sessionID];
            var index = tokens.indexOf(token);

            // If the token exists
            if (index !== -1) {
                // Token removed
                tokens.splice(index, 1);
            } else {
                var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
                console.log(msg);
            }
            if (tokens.length == 0) {
                // Last user left: session must be removed
                console.log(sessionID + ' empty!');
                delete mapSessions[sessionID];
            }
            return res.status(200).send();
        } else {
            var msg = 'Problems in the app server: the SESSION does not exist';
            console.log(msg);
            return res.status(500).send(msg);
        }
    }
}

exports.session = function(req, res) {
    var username = req.session.loggedUser;
    if (!username) {
        return res.redirect('/home');
    }

    return res.render('session.ejs', {
           user: username
    });
}
