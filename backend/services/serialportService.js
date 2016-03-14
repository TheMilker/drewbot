var five = require("johnny-five");
var repl = true;
// var repl = false;
var board;

var lifterServo;
var leftServo;
var rightServo;

connect();

function connect() {
    board = new five.Board({ repl: repl });
    board.on("ready", () => {
        lifterServo = new five.Servo(9);
        leftServo = new five.Servo(10);
        rightServo = new five.Servo(11);
        // board.pinMode(9, five.Pin.SERVO);
        // board.pinMode(10, five.Pin.SERVO);
        // board.pinMode(11, five.Pin.SERVO);

        board.repl.inject({
            i: lifterServo,
            l: leftServo,
            r: rightServo
        });
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
    
    if(servoId === "l") {
        leftServo.to(servoCommand);
    } else if(servoId === "r") {
        rightServo.to(servoCommand);
    } else if(servoId === "i") {
        lifterServo.to(servoCommand);
    }
}

function writeCommands(commands) {
    /* jshint ignore:start */
    for (var i = 0; i < commands.length;) {
        if(commands[i].indexOf("i") === -1) {
            (function(i){
                setTimeout(function() {
                    var commandL = commands[i];
                    var commandR = commands[i+1];
                    writeCommand(commandL);
                    writeCommand(commandR);
                }, 20 * i);
            }(i));
            i = i+2;
        } else {
            (function(i){
                setTimeout(function() {
                    var commandI = commands[i];
                    writeCommand(commandI);
                }, 20 * i);
            }(i));
            i = i+1;
        }
    }
    /* jshint ignore:end */
}

module.exports = {
    writeCommand: writeCommand,
    writeCommands: writeCommands,
    connect: connect
};