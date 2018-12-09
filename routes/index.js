var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var fs = require('fs');

var spotifyApi;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Oort' });
});

router.get('/playlists', function (req, res, next) {
  var code = req.query["code"];

  spotifyApi.setCredentials({
    clientSecret: '80fba228fc5b4a8397f2462ea6f7cbf8',
    clientId: '5f2ea699b7a548f68001465a874ef9f0'
  });

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    function (data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);

      // Set the access token on the API object to use it in later calls
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);

      spotifyApi.getUserPlaylists()
        .then(function (data) {
          console.log('Retrieved playlists', data.body);

          res.render('playlists', { title: 'Playlists', names: data.body.items });
        }, function (err) {
          console.log('Something went wrong!', err);
          res.redirect('/');
        });


    },
    function (err) {
      console.log('Something went wrong!', err);
      res.redirect('/');
    }
  );


});

router.get('/spotify', function (req, res, next) {
  //res.render('index', {title: 'Oort'});

  var scopes = ['playlist-read-private'];

  var credentials = {
    clientId: '5f2ea699b7a548f68001465a874ef9f0',
    redirectUri: 'http://' + req.hostname + ':' + req.socket.localPort + '/playlists'
  };

  spotifyApi = new SpotifyWebApi(credentials);

  // Create the authorization URL
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes);

  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
  res.redirect(authorizeURL);
});

router.get('/playlists/:id', function (req, res, next) {
  spotifyApi.getPlaylist(req.params.id)
    .then(function (data) {
      console.log('Some information about this playlist', data.body.tracks.items[0]);

      var room_id = 0;

      forStorage = data.body.tracks.items.map(song => {return {
            "songID": song.track.id,
            "name": song.track.name,
            "artist": song.track.artists[0].name,
            "votes": 0
      }});

      var id = Math.floor(100000 + Math.random() * 900000).toString();

      roomObject = {
          id: forStorage
      };

        saveDictToPublicFolder(roomObject, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Saved File");
        });

      res.render('voting', { title: 'Oort', roomID: room_id, songLists: data.body.tracks.items });

    }, function (err) {
      console.log('Something went wrong!', err);
    });
});

function saveDictToPublicFolder(fileData, callback) {
    fs.writeFile('./public/file.json', JSON.stringify(fileData, null, 4), callback);

}


module.exports = router;
