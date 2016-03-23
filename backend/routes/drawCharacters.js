var express = require('express');
var DrewbotUtils = require('./../services/drewbotUtils');
var SerialportService = require('./../services/serialportService');
var StrokeService = require('./../services/strokeService');
var ServoCommandService = require('./../services/servoCommandService');

var router = express.Router();

router.post('/', function(req, res) {

    var strokeCommands = StrokeService.getStrokeCommandsFromString(req.body.message);
    var servoCommands = ServoCommandService.getServoCommands(strokeCommands);
    SerialportService.writeServoCommands(servoCommands);

    res.send('Drawing message... ' + DrewbotUtils.getCurrentFormattedTime());
});

module.exports = router;