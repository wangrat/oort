var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
var fs = require('fs');
var storage = require('./storage.js')
//ar apps = require('./app.js')
var spotify = require('./spotify.js')


/* GET home page. */
router.get('/', function (req, res, next) {
  var name = storage.name;
  console.log(name);
  storage.name = "changed"
  console.log(name);

  res.render('index', { title: 'Oort' });
});

router.get('/playlists', function (req, res, next) {
  var code = req.query["code"];

  try {
    spotify.spotifyApi.setCredentials({
      clientSecret: '80fba228fc5b4a8397f2462ea6f7cbf8',
      clientId: '5f2ea699b7a548f68001465a874ef9f0'
    });
  }
  catch{
    res.redirect('/');
  }

  // Retrieve an access token and a refresh token
  spotify.spotifyApi.authorizationCodeGrant(code).then(
    function (data) {
      console.log('The token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      console.log('The refresh token is ' + data.body['refresh_token']);

      // Set the access token on the API object to use it in later calls
      spotify.spotifyApi.setAccessToken(data.body['access_token']);
      spotify.spotifyApi.setRefreshToken(data.body['refresh_token']);

      var userID = '';
      var userName = '';
      spotify.spotifyApi.getMe().then(function (data) {
        //console.log("User Info:", data.body);
        console.log("User info:", data.body.display_name, "ID:", data.body.id)
        userID = data.body.id;
        userName = data.body.display_name;

      }, function (err) {
        console.log('Something went wrong!', err);
        res.redirect('/');
      });

      var playlistListingAll = [];


      var playlistFetch = spotify.spotifyApi.getUserPlaylists({ limit: 50, offset: 50 })
        .then(function (data) {
          //console.log('Retrieved playlists', data.body);
          console.log('Retrieved', data.body.items.length, 'playlists.')
          var playlistListing = [];

          //console.log("Items", data.body.items);
          for (var i in data.body.items) {
            //console.log("Owner Data:", data.body.items[i].owner);
            var ownerID = data.body.items[i].owner.id;
            if (ownerID == userID) {
              //console.log("Owned by current user!:", data.body.items[i].name);
              playlistListing.push(data.body.items[i]);
            }
            else if (data.body.items[0].collaborative) {
              //console.log("Playlist is Collaborative!:", data.body.items[i].name);
              playlistListing.push(data.body.items[i]);
            }
            else {
              //console.log("ID:", ownerID, ":", data.body.items[i]);
            }

          }
          console.log("Found", playlistListing.length, "editable playlists - collaborative, or owned by ID", userID);
          //res.render('playlists', { title: 'Playlists', names: playlistListing, user_id: userID });
          return playlistListing;

          //res.render('playlists', { title: 'Playlists', names: data.body.items, user_id: userID });
        }, function (err) {
          console.log('Something went wrong!', err);
          res.redirect('/');
        });


      playlistFetch.then(function (pfetch) {
        console.log("Found", pfetch.length, "editable playlists total- collaborative, or owned by ID", userID);
        res.render('playlists', { title: 'Playlists', names: pfetch, user_id: userID, user_name: userName });
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

  var scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-read-playback-state'];

  var credentials = {
    clientId: '5f2ea699b7a548f68001465a874ef9f0',
    redirectUri: 'http://' + req.hostname + ':' + req.socket.localPort + '/playlists'
  };

  spotify.spotifyApi = new SpotifyWebApi(credentials);

  // Create the authorization URL
  var authorizeURL = spotify.spotifyApi.createAuthorizeURL(scopes);

  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
  res.redirect(authorizeURL);
});

router.get('/playlists/:id', function (req, res, next) {
  spotify.spotifyApi.getPlaylist(req.params.id)
    .then(function (data) {
      console.log('Some information about this playlist', data.body.tracks.items[0]);

      var forStorage = {};

      data.body.tracks.items.forEach(song => {
        forStorage[song.track.id] = {
          "name": song.track.name,
          "artist": song.track.artists[0].name,
          "votes": 0,
          "playlistsID": data.body.id,
          "songID": song.track.id
        }
      })

      var id = Math.floor(100000 + Math.random() * 900000).toString();

      storage.rooms[id] = forStorage;


      /*
      saveDictToPublicFolder(roomObject, function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Saved File");
      });
      */

      res.redirect('/rooms/' + id)

    }, function (err) {
      console.log('Something went wrong!', err);
    });
});

router.get('/rooms/:id', function (req, res, next) {

  currentRoomSongs = storage.rooms[req.params.id]

  songs = []

  spotify.spotifyApi.getMyCurrentPlaybackState({})
    .then(function (data) {
      // Output items
      console.log("Now Playing: ", data.body);

      var currentId;
      var currentSong;

      if (data.body.item === undefined) {
        currentId = "";
        currentSong = "";
      } else {
        currentId = data.body.item.id;
        currentSong = data.body.item.name + " - " + data.body.item.artists[0].name
      }


      for (var key in currentRoomSongs) {
        // check if the property/key is defined in the object itself, not in parent
        if (currentRoomSongs.hasOwnProperty(key)) {
          if (currentRoomSongs[key].songID == currentId) {
            currentRoomSongs[key].votes = 0;
          }

          songs.push(currentRoomSongs[key]);
        }
      }

      songs.sort(compare);
      console.log(songs);

      res.render('voting', {
        title: 'Oort',
        roomID: req.params.id,
        songLists: songs,
        currentSong: currentSong
      });

      idx = setInterval(function () {
        if (storage.onChange == 1) { // I guess you wanted a check for STATUS instead of VAR
          return clearInterval(idx);
        }
      }, 3000); // the interval when to call the function again 3000ms = 3sek
      storage.onChange = 0;
      res.redirect('back');
    }, function (err) {
      console.log('Something went wrong!', err);
      res.redirect('/')
    });


  //while (storage.onChange == 0) { };
  //storage.onChange = 0;
  //res.redirect('back');


});

/*
function saveDictToPublicFolder(fileData, callback) {
  fs.writeFile('./public/file.json', JSON.stringify(fileData, null, 4), callback);

}
*/

function compare(a, b) {
  if (a.votes < b.votes)
    return 1;
  if (a.votes > b.votes)
    return -1;
  return 0;
}


module.exports = router;
