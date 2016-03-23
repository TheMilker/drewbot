var express = require('express');
var drewbotUtils = require('./../services/drewbotUtils');
var serialportService = require('./../services/serialportService');
var ServoCommandFactory = require('./../services/classes/ServoCommandFactory');
var _und = require('underscore');

var router = express.Router();

router.post('/', function(req, res) {

    var commands = req.body.commands;
    var servoCommands = _und.map(commands, (servoCommand) => {
        return ServoCommandFactory.ServoCommand(servoCommand.servoId, servoCommand.servoPosition);
    });
    serialportService.writeServoCommands(servoCommands);
    res.send("Commands Sent." + drewbotUtils.getCurrentFormattedTime());
});

module.exports = router;