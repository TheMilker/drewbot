var Constants = require('./constants');

function getServoCommands(strokeCommands) {
    var servoCommands = []; //TODO use underscore map?
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
    return servoCommands;
}

module.exports = {
    getServoCommands: getServoCommands
};