var db       = require('./db');
var fs       = require('fs');
var bcrypt   = require('bcrypt');
var ObjectID = require('mongodb').ObjectID;

var salt = fs.readFileSync(__dirname + '/hash.txt', 'utf-8');

exports.findByName = function(name, cb) {
    db.get().collection('user').findOne({ username: name }, function (err, doc) {
        cb(err, doc);
    });
}

exports.addNewUser = function(user, cb) {
    user.password = bcrypt.hashSync(user.password, salt);
    db.get().collection('user').insert(user, function(err) {
        cb(err);
    });
}

exports.letIn = function(usesrname, password, cb) {
    var cryptedPass = bcrypt.hashSync(password, salt);
    db.get().collection('user').findOne({ "username": usesrname, "password": cryptedPass }, function (err, doc) {
        cb(err, (doc != null));
    });
};
