var userModel = require('../model/user.js');

exports.registraion = function(req, res) {
  if (req.session.loggedUser) {
      user = req.session.loggedUser;
      res.redirect('/home');
  } else {
      req.session.destroy();
      res.render('registration.ejs');
  }
}

function checkNewUserParams(userame, pass, passCheck, email, cb) {
    if (userame && pass && passCheck && email) {
        if (pass.length < 3) {
            cb("Password is too short")
        } else if (pass != passCheck) {
            cb("Passwords should be equal");
        } else {
            userModel.findByName(userame, function(err, doc) {
                if (err) {
                    cb(err);
                } else if (doc) {
                    cb(`User with name ${userame} already exists`);
                } else {
                    cb();
                }
            });
        }
    } else {
        cb("Incorrect parameter");
    }
}

exports.addNewUser = function(req, res) {
    var username  = req.body.user;
    var pass      = req.body.pass;
    var passCheck = req.body.passCheck;
    var email     = req.body.email;

    checkNewUserParams(username, pass, passCheck, email, function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            var newUser = {
                username: username,
                email: email,
                sessions: [],
                registrationData: Date(),
                password: pass
            };

            userModel.addNewUser(newUser, function(err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    req.session.loggedUser = newUser.username;
                    res.status(200).send();
                }
            });
        }
    });
}
