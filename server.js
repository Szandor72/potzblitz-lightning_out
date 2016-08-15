var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var env = require('node-env-file');

// Load environment variables for localhost
try {
    env(__dirname + '/.env');
} catch (e) {}

var app = express();

var port = process.env.PORT || 5000;
var https_port = process.env.HTTPS_PORT || parseInt(port) + 1;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index', {
        appId: process.env.APPID,
        loApp: process.env.LOAPP
    });
});

app.get('/oauthcallback', function(req, res) {
    res.render('oauthcallback', {});
});

// Create an HTTP service
//
http.createServer(app).listen(port);
console.log("Server listening for HTTP connections on port ", port);

// Create a localmachine HTTPS service if the certs are present
// ftw: http://blog.matoski.com/articles/node-express-generate-ssl/
try {
    var secureServer = https.createServer({
        key: fs.readFileSync('./ssl/server.key'),
        cert: fs.readFileSync('./ssl/server.crt'),
        ca: fs.readFileSync('./ssl/ca.crt'),
        requestCert: true,
        rejectUnauthorized: false
    }, app).listen(https_port, function() {
        console.log("Secure Express server listening on port ", https_port);
    });

} catch (e) {
    console.error("Security certs not found, HTTPS not available for localhost");
}
