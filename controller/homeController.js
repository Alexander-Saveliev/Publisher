var userModel = require('../model/user.js');

exports.letIn = function(req, res) {
    if (req.session.loggedUser) {
        var username = req.session.loggedUser;
        res.render('home.ejs', {
    	       user: username
    	});
    } else {
        var username = req.body.user;
        var password = req.body.pass;

        if (!username || !password) {
            req.session.destroy();
            res.redirect('/');
        } else {
            userModel.letIn(username, password, function(err, correct) {
                if (err) {
                    req.session.destroy();
                    res.status(500).send(err);
                } else if (correct) {
                    req.session.loggedUser = username;
                    res.status(200).send();
                } else {
                    req.session.destroy();
                    res.status(400).send("Incorrect username or password");
                }
            });
        }
    }
}

exports.about = function(req, res) {
    if (req.session.loggedUser) {
        user = req.session.loggedUser;
        res.render('about.ejs', {
            user: user
        });
    } else {
        req.session.destroy();
        res.render('about.ejs', {
            user: "Log in"
        });
    }
}
