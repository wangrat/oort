var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Oort' });
});


// routes will go here
router.get('/api/users', function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  var room_id = req.param('id');

  var songData = {
    id: room_id,
    songs: [
      { name: "despacito", artist: "spanish man", votes: 15 },
      { name: "screaming in the eternal void", artist: "me", votes: -1 },
      { name: "pls stop calling me 'daddy'", artist: "kolling", votes: 3 }
    ]
  };


  saveDictToPublicFolder(songData, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Saved File");
  });


  if (room_id) {
    res.send(JSON.stringify(songData, null, 4));
  }
  else {
    res.send("Send a room ID first pls.")
  }
  //res.send(user_id + '<br>' + token + '\n' + geo);
  getSongDataByRoomId(room_id);

});

function saveDictToPublicFolder(fileData, callback) {
  fs.writeFile('./public/file.json', JSON.stringify(fileData, null, 4), callback);
}

function getSongDataByRoomId(roomID) {
  fs.readFile('./public/file.json', handleFile);
}

// Write the callback function
function handleFile(err, data) {
  if (err) throw err
  songData = JSON.parse(data)
  // You can now play with your datas
  console.log(songData);
  

  //return songData;
}

module.exports = router;
