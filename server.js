/* CONFIGURATION */

// Check launch arguments: must receive openvidu-server URL and the secret
if (process.argv.length != 4) {
    console.log("Usage: node " + __filename + " OPENVIDU_URL OPENVIDU_SECRET");
    process.exit(-1);
}
// For demo purposes we ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

var express    = require('express');
var fs         = require('fs');
var session    = require('express-session');
var https      = require('https');
var bodyParser = require('body-parser');
var app        = express();

app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: process.argv[3]
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

/* END CONFIGURATION */


/* CONTROLLERS */

var loginController        = require('./controller/loginController');
var registrationController = require('./controller/registrationController');
var homeController         = require('./controller/homeController');
var sessionController      = require('./controller/sessionController');



/* INTERACTION */

app.get('/', loginController.login);

app.get('/registration', registrationController.registraion);
app.post('/registration', registrationController.addNewUser);

app.get('/home', homeController.letIn);
app.post('/home', homeController.letIn);

app.post('/logout', loginController.logout);

app.post('/create-session', sessionController.createSession);
app.post('/join-session', sessionController.joinSession);
app.post('/leave-session', sessionController.leaveSession);

app.get('/session', sessionController.session);
app.get('/about', homeController.about)
