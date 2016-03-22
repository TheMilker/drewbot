var Constants = require('./constants');
var five = require("johnny-five");
//var repl = true;
var repl = false;
var board;

var lifterServo;
var leftServo;
var rightServo;

//connect();

function connect() {
    board = new five.Board({
        repl: repl,
        //port: "COM3"
    });
    board.on("ready", () => {
        lifterServo = new five.Servo(9);
        leftServo = new five.Servo(10);
        rightServo = new five.Servo(11);
        // board.pinMode(9, five.Pin.SERVO);
        // board.pinMode(10, five.Pin.SERVO);
        // board.pinMode(11, five.Pin.SERVO);

        // board.repl.inject({
        //     i: lifterServo,
        //     l: leftServo,
        //     r: rightServo
        // });
    });

    board.on("message", function(event) {
        /*
            Event {
                type: "info"|"warn"|"fail",
                timestamp: Time of event in milliseconds,
                class: name of relevant component class,
                message: message [+ ...detail]
            }
        */
        console.log("Received a %s message, from %s, reporting: %s", event.type, event.class, event.message);
    });
}

function writeCommand(command) {
    var servoId = command.substring(0,1);
    var servoCommand = parseInt(command.substring(1));

    if(servoId === Constants.SERVO_ID.LEFT) {
        leftServo.to(servoCommand);
    } else if(servoId === Constants.SERVO_ID.RIGHT) {
        rightServo.to(servoCommand);
    } else if(servoId === Constants.SERVO_ID.LIFTER) {
        lifterServo.to(servoCommand);
    }
}

function writeServoCommand(servoCommand) {

    if(servoCommand.servoId === Constants.SERVO_ID.LEFT) {
        console.log("l: ", servoCommand.servoPosition);
        //leftServo.to(servoCommand.servoPosition);
    } else if(servoCommand.servoId === Constants.SERVO_ID.RIGHT) {
        console.log("r: ", servoCommand.servoPosition);
        //rightServo.to(servoCommand.servoPosition);
    } else if(servoCommand.servoId === Constants.SERVO_ID.LIFTER) {
        console.log("i: ", servoCommand.servoPosition);
        //lifterServo.to(servoCommand.servoPosition);
    }
}

function writeStrokeCommands(strokeCommands) {
    var servoCommands = getServoCommandsArray(strokeCommands);
    writeServoCommands(servoCommands);
}

function writeServoCommands(servoCommands) {
    console.log("commands to send: ", servoCommands.length);
    var i = 0;
    var interval = setInterval(function() {
        var servoCommand = servoCommands[i];
        if(servoCommand.servoId === Constants.SERVO_ID.LIFTER) {
            writeServoCommand(servoCommands[i]);
            i = i+1;
        } else if(servoCommand.servoId === Constants.SERVO_ID.LEFT) {
            writeServoCommand(servoCommands[i]);
            writeServoCommand(servoCommands[i+1]);
            i = i+2;
        }
        if(i > servoCommands.length-1) {
            clearInterval(interval);
        }
    }, 20);
}

function getServoCommandsArray(strokeCommands) {
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
    return servoCommands;
}

module.exports = {
    writeCommand: writeCommand,
    writeStrokeCommands: writeStrokeCommands,
    connect: connect
};