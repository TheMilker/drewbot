var express = require('express');
var DrewbotUtils = require('./../services/drewbotUtils');
var SerialportService = require('./../services/serialportService');
var StrokeService = require('./../services/strokeService');
var ServoCommandService = require('./../services/servoCommandService');

var router = express.Router();

router.post('/', function(req, res) {

    // var strokeCommands = StrokeService.getStrokeCommands(req.body.strokes);
    // var servoCommands = ServoCommandService.getServoCommands(strokeCommands); //TODO fuse these services?
    // SerialportService.writeServoCommands(servoCommands);

    // res.send('Drawing Strokes... ' + DrewbotUtils.getCurrentFormattedTime());
});

module.exports = router;