var express = require('express');
var drewbotUtils = require('./../services/drewbotUtils');
var serialportService = require('./../services/serialportService');

var router = express.Router();

router.post('/', function(req, res) {
    
    var command = req.body.command;
    if(!drewbotUtils.endsWith(command, "\n")) {
        command = command+"\n";
    }

    serialportService.writeCommand(command);
    res.send("Command " + command +" Sent." + drewbotUtils.getCurrentFormattedTime());
});

module.exports = router;