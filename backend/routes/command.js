var express = require('express');
var drewbotUtils = require('./../services/drewbotUtils');
var serialportService = require('./../services/serialportService');
var ServoCommandFactory = require('./../services/classes/ServoCommandFactory');

var router = express.Router();

router.post('/', function(req, res) {
    var command = req.body.command;
    var servoCommand = ServoCommandFactory.ServoCommand(command.servoId, command.servoPosition);
    serialportService.writeServoCommand(servoCommand);
    res.send("Command " + JSON.stringify(command) +" Sent." + drewbotUtils.getCurrentFormattedTime());
});

module.exports = router;