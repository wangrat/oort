var express = require('express');
var router = express.Router();
var fs = require('fs');
const doAsync = require('doasync');

var storage = require('./../storage.js')
var spotify = require('./../spotify.js')


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
    //console.log(storage.rooms[roomID][songID]["votes"]);
    storage.rooms[roomID][songID]["votes"] += voteDelta;
    //console.log(storage.rooms[roomID][songID]["votes"]);
    storage.onChange = 1;

    currentRoomSongs = storage.rooms[roomID]

    songs = []

    for (var key in currentRoomSongs) {
        // check if the property/key is defined in the object itself, not in parent
        if (currentRoomSongs.hasOwnProperty(key)) {
            songs.push(currentRoomSongs[key])
        }
    }

    songs.sort(compare);

    songsURI = songs.map(s => 'spotify:track:' + songs.songID)

    spotify.spotifyApi.replaceTracksInPlaylist(songs[0].playlistID, songsURI)
        .then(function (data) {
            console.log("replaced!!!")
        }, function (err) {
            console.log("not replaced :(")
        })
}

function getSongRooms() {
    return doAsync(fs).readFile('./public/file.json')
        .then(function (data) {
            //return data;
            //console.log(data);
            return data;
        });
}

function compare(a, b) {
    if (a.votes < b.votes)
        return 1;
    if (a.votes > b.votes)
        return -1;
    return 0;
}

module.exports = router;