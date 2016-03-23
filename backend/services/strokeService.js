const Constants = require('./constants');
const ServoCommandFactory = require('./classes/ServoCommandFactory');
const StrokeCommandFactory = require('./classes/StrokeCommandFactory');
const AngleFactory = require('./classes/AngleFactory');
const ArmFactory = require('./classes/ArmFactory');
const PointFactory = require('./classes/PointFactory');
const FontService = require('./fonts/fontService');
const _und = require('underscore');

var globalLeftAngle = AngleFactory.Angle(125, true);
var globalRightAngle = AngleFactory.Angle(75, true);
var fonts = FontService.getFonts();

function getStrokeCommandsFromString(str) {
    var offsetX = Constants.FIRST_CHAR_X;
    var strokes = [];

    if(fonts && fonts.erik) {
        var font = fonts.erik;

        _und.each(str, (currentCharacter, index) => {
            var characterStrokes = font[currentCharacter.toString()];
            strokes.push({
                x: characterStrokes[0].x + offsetX,
                y: characterStrokes[0].y,
                draw: false
            });
            _und.each(characterStrokes, (strokeData) => {
                strokes.push({
                    x: strokeData.x + offsetX,
                    y: strokeData.y,
                    draw: strokeData.draw
                });
            });
            strokes.push({
                x: currentCharacter[currentCharacter.length-1].x + offsetX,
                y: currentCharacter[currentCharacter.length-1].y,
                draw: false
            });
            offsetX += Constants.DIGIT_OFFSET;
        });
    }
    return getStrokeCommands(strokes);
}

function getStrokeCommands(strokes) {
    var strokeCommands = [];
    strokes.forEach((stroke) => {
        var strokeCommand = getStrokeCommand(stroke);
        strokeCommands.push(strokeCommand);
    });
    return strokeCommands;
}

function getStrokeCommand(stroke) {

    globalLeftAngle = determineBaseAngleFromPosition(stroke, getLeftBaseArm(globalLeftAngle), true);
    globalRightAngle = determineBaseAngleFromPosition(stroke, getRightBaseArm(globalRightAngle), false);

    var leftServoCommand = ServoCommandFactory.ServoCommand(Constants.SERVO_ID.LEFT, 180 - Math.floor(globalLeftAngle.degrees));
    var rightServoCommand = ServoCommandFactory.ServoCommand(Constants.SERVO_ID.RIGHT, 180 - Math.floor(globalRightAngle.degrees));
    var lifterServoCommand;
    if(stroke.draw) {
        lifterServoCommand = ServoCommandFactory.ServoCommand(Constants.SERVO_ID.LIFTER, Constants.SERVO_POSITION.DOWN);
    } else {
        lifterServoCommand = ServoCommandFactory.ServoCommand(Constants.SERVO_ID.LIFTER, Constants.SERVO_POSITION.UP);
    }
    return StrokeCommandFactory.StrokeCommand(leftServoCommand, rightServoCommand, lifterServoCommand);
}

function determineBaseAngleFromPosition(strokePoint, baseArm, isLeft) {

    var points = circleIntersectionPoints(baseArm.point, baseArm.length, strokePoint, Constants.ARM_LENGTH);
    // Use the correct intersection point
    var x;
    var y;
    // If we're looking at left base, use left most intersection
    // If we're looking at not left base, use right most intersection
    if (points[0].x <= points[1].x && isLeft) {
        x = points[0].x;
        y = points[0].y;
    } else if (points[0].x >= points[1].x && !isLeft) {
        x = points[0].x;
        y = points[0].y;
    } else {
        x = points[1].x;
        y = points[1].y;
    }

    var result;
    if (x <= baseArm.point.x) {
        result = AngleFactory.Angle(Math.PI - Math.asin(y / baseArm.length), false);
    } else {
        result = AngleFactory.Angle(Math.asin(y / baseArm.length), false);
    }
    return result;
}

// Returns array of two intersection points.
function circleIntersectionPoints(p1, p1Length, p2, p2Length) {
    // Stolen from:
    // http://ambrsoft.com/TrigoCalc/Circles2/Circle2.htm


    var a = p1.x;
    var b = p1.y;
    var c = p2.x;
    var d = p2.y;

    var D = Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2));

    var delta = Math.sqrt((D + p1Length + p2Length) * (D + p1Length - p2Length) * (D - p1Length + p2Length) * (-D + p1Length + p2Length)) / 4.0;

    var xBase = (a + c) / 2.0 + (c - a) * (p2Length * p2Length - p1Length * p1Length) / (2.0 * D * D);
    var yBase = (b + d) / 2.0 + (d - b) * (p2Length * p2Length - p1Length * p1Length) / (2.0 * D * D);

    var x1 = xBase + 2 * (d - b) * delta / (D * D);
    var x2 = xBase - 2 * (d - b) * delta / (D * D);
    var y1 = yBase - 2 * (c - a) * delta / (D * D);
    var y2 = yBase + 2 * (c - a) * delta / (D * D);

    var connectionPoints = [];
    connectionPoints[0] = PointFactory.Point(x1, y1);
    connectionPoints[1] = PointFactory.Point(x2, y2);

    return connectionPoints;
}

function getLeftBaseArm(angle) {
    return ArmFactory.Arm(Constants.ARM_LENGTH * 2, 0, angle, Constants.ARM_LENGTH);
}

function getRightBaseArm(angle) {
    return ArmFactory.Arm(Constants.ARM_LENGTH * 2 + Constants.CANVAS_SCALE_FACTOR * 20, 0, angle, Constants.ARM_LENGTH);
}

module.exports = {
    getStrokeCommands: getStrokeCommands,
    getStrokeCommandsFromString: getStrokeCommandsFromString
};