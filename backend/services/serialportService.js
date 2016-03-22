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

module.exports = {
    writeServoCommand: writeServoCommand,
    writeServoCommands: writeServoCommands,
    connect: connect
};