exports.login = function(req, res) {
    if (req.session.loggedUser) {
        user = req.session.loggedUser;
        res.redirect('/home');
    } else {
        req.session.destroy();
        res.render('login.ejs');
    }
}

exports.logout = function(req, res) {
    req.session.destroy();
    res.status(200).send();
}
