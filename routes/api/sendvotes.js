var express = require('express');
var router = express.Router();

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
    res.send(JSON.stringify(inQueries, null, 4));


    //res.send(req.param('id'));


});

module.exports = router;