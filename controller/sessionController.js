exports.createSession = function(req, res) {
    if (!req.session.loggedUser) {
        return res.status(400).send("Unauthorized");
    }

    var sessionName = req.body.sessionName;
    var description = req.body.description;

    if (!sessionName) {
        return res.status(400).send("session name is empty");
    }

    if (!description) {
        return res.status(400).send("description is empty");
    }

    console.log(sessionName);
    console.log(description);
    res.status(200).send();
}

exports.joinSession = function(req, res) {
    if (!req.session.loggedUser) {
        return res.status(400).send("Unauthorized");
    }

    var sessionID = req.body.sessionID;

    if (!sessionID) {
        return res.status(400).send("SessionID is empty");
    }

    console.log(sessionID);
    res.status(200).send();
}

exports.session = function(req, res) {
    var username = req.session.loggedUser;
    if (!username) {
        return res.redirect('/home');
    }

    res.render('session.ejs', {
           user: username
    });
}
