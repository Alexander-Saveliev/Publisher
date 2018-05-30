process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express    = require('express');
var fs         = require('fs');
var session    = require('express-session');
var https      = require('https');
var bodyParser = require('body-parser');

var app        = express();

app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'MY_SECRET'
}));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.engine('ejs', require('ejs-locals'));

var PORT = 2727;
var options = {
    key:  fs.readFileSync(__dirname + '/ssl/server.key'),
    cert: fs.readFileSync(__dirname + '/ssl/server.crt')
};

var db = require('./model/db');
db.connect('mongodb://localhost:27017', function(err) {
    if (err) {
        return console.log(err);
    }
    https.createServer(options, app).listen(PORT);
    console.log('server listen port: ' + PORT);
});


// controllers
var loginController        = require('./controller/loginController');
var registrationController = require('./controller/registrationController');
var homeController         = require('./controller/homeController');

app.get('/', loginController.login);

app.get('/registration', registrationController.registraion);
app.post('/registration', registrationController.addNewUser);

app.get('/home', homeController.letIn);
app.post('/home', homeController.letIn);

app.post('/logout', loginController.logout);