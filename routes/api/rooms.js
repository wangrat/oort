var express = require('express');
var router = express.Router();
var fs = require('fs');
const doAsync = require('doasync');

var storage = require('./../storage.js')


// routes will go here
router.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    //var name = storage.name;
    //console.log(name);
    //storage.name = "changed"
    //console.log(name);

    var room_id = req.param('id');

    var roomsJSON = JSON.stringify(storage.rooms, null, 4); // spacing level = 2


    res.send(roomsJSON);

    /*
        if (room_id) {
            //res.send(getSongDataByRoomId(room_id))
            //res.send(storage.rooms);
            res.send(roomsJSON);
            /*
            getSongRooms().then(function (returndata) {
                //received data!
                res.send(returndata);
            });
            
    }

    else {

        res.send(roomsJSON);

        /*
        getSongRooms().then(function (returndata) {
            //received data!
            res.send(returndata);
        });
        
        }
    */


});


/*
function getSongRooms() {
    return doAsync(fs).readFile('./public/file.json')
        .then(function (data) {
            //return data;
            //console.log(data);
            return data;
        });
}
*/



module.exports = router;