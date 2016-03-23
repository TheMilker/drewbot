var Constants = require('./constants');
var _und = require('underscore');

function getServoCommands(strokeCommands) {
    var servoCommands = [];
    strokeCommands.forEach(function(strokeCommand) {
        if(strokeCommand.lifterServoCommand.servoPosition === Constants.SERVO_POSITION.DOWN) {
            servoCommands.push(strokeCommand.leftServoCommand);
            servoCommands.push(strokeCommand.rightServoCommand);
            servoCommands.push(strokeCommand.lifterServoCommand);
        } else if(strokeCommand.lifterServoCommand.servoPosition === Constants.SERVO_POSITION.UP) {
            servoCommands.push(strokeCommand.lifterServoCommand);
            servoCommands.push(strokeCommand.leftServoCommand);
            servoCommands.push(strokeCommand.rightServoCommand);
        }
    });
    return removedDuplicateLifterCommands(servoCommands);
}

function removedDuplicateLifterCommands(servoCommands) {
    var filteredServoCommands = [];
    var lastLifterServoCommand;
    servoCommands.forEach(function(servoCommand) {
        if(servoCommand.servoId == Constants.SERVO_ID.LIFTER) {
            if(!lastLifterServoCommand || lastLifterServoCommand.servoPosition !== servoCommand.servoPosition) {
                filteredServoCommands.push(servoCommand);
            }
            lastLifterServoCommand = servoCommand;
        } else {
            filteredServoCommands.push(servoCommand);
        }
    });
    return filteredServoCommands;
}

module.exports = {
    getServoCommands: getServoCommands
};