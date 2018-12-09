var express = require('express');
var router = express.Router();
var fs = require('fs');
const doAsync = require('doasync');

var storage = require('./../storage.js')


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
    //console.log(inQueries);

    updateRoomWithVote(room_id, song_id, voteIncrement);

    //console.log(getSongRooms());
    //var songRooms = getSongRooms();
    //console.log(songRooms);

    //songRooms.then(function (result) {
    //    console.log(result);
    //});
    res.send(storage.rooms[room_id][song_id]);
    //res.send("sent");

    //console.log(storage.rooms[room_id]);
});

function updateRoomWithVote(roomID, songID, voteDelta) {
    voteDelta = Number(voteDelta)
    console.log(storage.rooms[roomID][songID]["votes"]);
    storage.rooms[roomID][songID]["votes"] += voteDelta;
    console.log(storage.rooms[roomID][songID]["votes"]);
    storage.onChange = 1;
}

function getSongRooms() {
    return doAsync(fs).readFile('./public/file.json')
        .then(function (data) {
            //return data;
            //console.log(data);
            return data;
        });
}

module.exports = router;