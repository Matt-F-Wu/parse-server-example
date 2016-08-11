// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}


var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myappid',
  masterKey: process.env.MASTER_KEY || 'mymasterkey', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'myserverurl',  // Don't forget to change to https if needed
  restAPIKey: process.env.REST_API_KEY || 'myrestapikey'
  push: {
    android: {
      senderId: '528033395445', // The Sender ID of GCM
      apiKey: 'AIzaSyAKWt2XGyLKblsQ9qs8U3HAhBKIQEuNHpI' // The Server API Key of GCM
    }
  },
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  appName: 'Favourama', // Hao: The following is to include the mail adapter
  publicServerURL: process.env.SERVER_URL || 'http://favourama.herokuapp.com/parse',
  verifyUserEmails: true,
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      apiKey: 'key-1a4f5fcaa31d61dda9042d4f4274721a',
      domain: 'favourama.com',
      fromAddress: 'account@favourama.com',
    }
  },
  customPages: {
      invalidLink: 'http://favourama.com/profile_management/invalid_link.html',
      verifyEmailSuccess: 'http://favourama.com/profile_management/verify_email_success.html',
      choosePassword: 'http://favourama.com/profile_management/choose_password.html',
      passwordResetSuccess: 'http://favourama.com/profile_management/password_reset_success.html'
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
