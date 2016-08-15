var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var env = require('node-env-file');
var oauth2 = require('salesforce-oauth2');

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
  var uri = oauth2.getAuthorizationUrl({
      redirect_uri: process.env.CALLBACKURL,
      client_id: process.env.APPID,
      scope: 'full'
  });
    res.render('index', {
        appId: process.env.APPID,
        loApp: process.env.LOAPP
    });
  return response.redirect(uri);
});

app.get('/oauthcallback', function(req, res) {
    var authorizationCode = request.param('code');

    oauth2.authenticate({
        redirect_uri: process.env.CALLBACKURL,
        client_id: process.env.APPID,
        client_secret: process.env.SECRET,
        code: authorizationCode
    }, function(error, payload) {
        /*

        The payload should contain the following fields:

        id 				A URL, representing the authenticated user,
                        which can be used to access the Identity Service.

        issued_at		The time of token issue, represented as the
                        number of seconds since the Unix epoch
                        (00:00:00 UTC on 1 January 1970).

        refresh_token	A long-lived token that may be used to obtain
                        a fresh access token on expiry of the access
                        token in this response.

        instance_url	Identifies the Salesforce instance to which API
                        calls should be sent.

        access_token	The short-lived access token.


        The signature field will be verified automatically and can be ignored.

        At this point, the client application can use the access token to authorize requests
        against the resource server (the Force.com instance specified by the instance URL)
        via the REST APIs, providing the access token as an HTTP header in
        each request:

        Authorization: OAuth 00D50000000IZ3Z!AQ0AQDpEDKYsn7ioKug2aSmgCjgrPjG...
        */
    });
    // have both authentications
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
