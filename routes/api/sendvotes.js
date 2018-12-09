var express = require('express');
var router = express.Router();
var fs = require('fs');
const doAsync = require('doasync');

/* GET home page. */
router.get('/', function (req, res, next) {

    var room_id = req.param('id');
    var song_id = req.param('songid');
    var voteIncrement = req.param('voteincrement');

    var inQueries = {
        "roomID": room_id,
        "songID": song_id,
        "voteDelta": voteIncrement
    }

    console.log(inQueries);

    updateRoomWithVote()

    res.send(JSON.stringify(inQueries, null, 4));


    //res.send(req.param('id'));


});

function updateRoomWithVote(roomID, songID, voteDelta) {
    getSongRooms().then(function (returndata) {
        //received data!
        res.send(returndata);
    });

}

var songData;
function getSongRooms() {


    return doAsync(fs).readFile('./public/file.json')
        .then(function (data) {
            //return data;
            //console.log(data);
            return data;
        });
}


module.exports = router;