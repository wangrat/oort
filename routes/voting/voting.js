var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var room_id = req.param('id');

    res.render('voting', { title: 'Oort', roomID: room_id });


});

module.exports = router;