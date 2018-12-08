var express = require('express');
var router = express.Router();
var fs = require('fs');
const doAsync = require('doasync');

// routes will go here
router.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var room_id = req.param('id');

    var songData =
    {
        "4": [
            { name: "despacito", artist: "spanish man", votes: 15 },
            { name: "screaming in the eternal void", artist: "me", votes: -1 },
            { name: "pls stop calling me 'daddy'", artist: "kolling", votes: 3 }
        ],
        "0": [
            { name: "peep", artist: "lettuce man", votes: 15 },
            { name: "asdlj", artist: "me", votes: -1 },
            { name: "pls stop calling me 'daddy'", artist: "kolling", votes: 3 }
        ]
    };

    /*
    saveDictToPublicFolder(songData, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Saved File");
    });
    */
    /*
    
      if (room_id) {
        res.send(JSON.stringify(songData, null, 4));
      }
      else {
        res.send("Send a room ID first pls.")
      }
      //res.send(user_id + '<br>' + token + '\n' + geo);
      getSongDataByRoomId(room_id);
    
      */

    if (room_id) {
        //res.send(getSongDataByRoomId(room_id))

        getSongRooms().then(function (returndata) {
            //received data!
            res.send(returndata);
        });
    }
    else {
        getSongRooms().then(function (returndata) {
            //received data!
            res.send(returndata);
        });
    }

});

function saveDictToPublicFolder(fileData, callback) {
    fs.writeFile('./public/file.json', JSON.stringify(fileData, null, 4), callback);

}

var songData;
function getSongRooms() {


    return doAsync(fs).readFile('./public/file.json')
        .then(function (data) {
            //return data;
            //console.log(data);
            return data;
        });


    //fs.readFile('./public/file.json', handleFile);
    //var songData;
    /*
    doAsync(fs).readFile('./public/file.json')
      .then((data) => console.log(JSON.parse(data)));
      */

    /*

    doAsync(fs).readFile('./public/file.json')
        .then((data) => songData = JSON.parse(data));


    console.log(songData[roomID]);
    //console.log(roomID);
    if (songData[roomID]) {
        return songData[roomID];
        //JSON.stringify(songData[roomID], null, 4)
    }
    else {
        return "";
    }
    */
}




module.exports = router;