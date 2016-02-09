(function() {
    'use strict';
    angular.module('em-drewbot').factory('bot', bot);

    bot.$inject = ['botEngine', 'simulatorConstants', 'botDraw', 'botDigitalClock', 'botCharGenerator', 'simulatorDataService'];

    function bot(botEngine, simulatorConstants, botDraw, botDigitalClock, botCharGenerator, simulatorDataService) {
        
        var instance = {};

        var globalLeftAngle = new Angle(125, true);
        var globalRightAngle = new Angle(75, true);   

        var strokePoints = [];

        var playbackStrokes = [];
        var playbackIndex;

        instance.moveToMousePos = function moveToMousePos(canvas, evt, mouseDown) {
            var rect = canvas.getBoundingClientRect();
            var stroke = new Stroke(
                evt.clientX - rect.left, 
                evt.clientY - rect.top,
                mouseDown
            );
            moveToPos(stroke, evt.shiftKey);
        };

        instance.clearStrokePoints = () => {
            strokePoints = [];
        };

        instance.update = function() {

            botDraw.clearCanvas();

            var leftBaseArm = instance.getLeftBaseArm(globalLeftAngle);
            var rightBaseArm = instance.getRightBaseArm(globalRightAngle);

            draw(leftBaseArm, rightBaseArm);
        };

        function moveToPos(stroke, shitKeyDown) {
            var tempLeftAngle = botEngine.determineBaseAngleFromPosition(stroke.point, instance.getLeftBaseArm(globalLeftAngle), true);
            var tempRightAngle = botEngine.determineBaseAngleFromPosition(stroke.point, instance.getRightBaseArm(globalRightAngle), false);

            if(shitKeyDown || (!shitKeyDown && stroke.draw)) {
                if (!isNaN(tempLeftAngle.degrees) && !isNaN(tempRightAngle.degrees)) {
                    updatePosition(stroke);
                    strokePoints.push(stroke);
                    botDraw.drawCircle(stroke.point, 15);
                } else {
                    instance.update();
                }
            } else {
                instance.update();
            }
            botDraw.addTextAtPosition("  (" + stroke.point.x + "," + stroke.point.y + ")", stroke.point);
        }

        function updatePosition(positionStroke) {

            var positionPoint = positionStroke.point;

            if (isNaN(positionPoint.x) || isNaN(positionPoint.y)) {
                return;
            }

            globalLeftAngle = botEngine.determineBaseAngleFromPosition(positionPoint, instance.getLeftBaseArm(globalLeftAngle), true);
            globalRightAngle = botEngine.determineBaseAngleFromPosition(positionPoint, instance.getRightBaseArm(globalRightAngle), false);

            addOutputAngleText(globalLeftAngle, globalRightAngle);
            botDraw.addOutputPositionText(positionStroke);

            instance.update();
        }

        function addOutputAngleText(leftAngle, rightAngle) {
            botDraw.addOutputText("L" + (180 - Math.floor(leftAngle.degrees)));
            botDraw.addOutputText("R" + (180 - Math.floor(rightAngle.degrees)));
        }

        function servoEndPoint(arm) {

            var x = Math.cos(arm.angle.radians) * arm.length + arm.point.x;
            var y = Math.sin(arm.angle.radians) * arm.length + arm.point.y;

            return new Point(x, y);
        }

        function positionOfConnection(point1, p1Length, point2, p2Length) {

            var intersectionPoints = botEngine.circleIntersectionPoints(point1, p1Length, point2, p2Length);
            var connectionPoint;

            // Use max y - it should never buckle down

            if (intersectionPoints[1].y > intersectionPoints[0].y) {
            connectionPoint = intersectionPoints[1];
            } else {
            connectionPoint = intersectionPoints[0];
            }

            return connectionPoint;
        }

        function draw(baseLeft, baseRight) {       

            // Add box for char size
            botDraw.drawCharOutline({ "x": baseLeft.point.x, "y": simulatorConstants.ARMLENGTH * 0.9 }, simulatorConstants.ARMLENGTH * 0.5, simulatorConstants.ARMLENGTH * 0.5);

            var leftEndPoint = servoEndPoint(baseLeft);
            var rightEndPoint = servoEndPoint(baseRight);

            // Draw the base arms
            botDraw.drawLine(baseLeft.point, leftEndPoint, "#111111");
            botDraw.drawLine(baseRight.point, rightEndPoint, "#00ff00");

            // Determine where connection, and draw top arms.
            var connectionPoint = positionOfConnection(leftEndPoint, baseLeft.length, rightEndPoint, baseRight.length);

            botDraw.drawLine(leftEndPoint, connectionPoint, "#0000ff");
            botDraw.drawLine(rightEndPoint, connectionPoint, "#ff0000");

            // If we're in drawing mode, draw the current set of points
            botDraw.applyStrokes(strokePoints);

            // Add some text to help with debugging
            botDraw.addTextAtPosition("  (" + Math.floor(connectionPoint.x) + "," + Math.floor(connectionPoint.y) + ")", connectionPoint);
            botDraw.addTextAtPosition("  Left(" + Math.floor(baseLeft.angle.degrees) + "\u00B0)", baseLeft.point);
            botDraw.addTextAtPosition("  Right(" + Math.floor(baseRight.angle.degrees) + "\u00B0)", baseRight.point);
        }

        instance.getLeftBaseArm = function(angle) {
            var arm = new Arm(simulatorConstants.ARMLENGTH * 2, 0, angle, simulatorConstants.ARMLENGTH);
            return arm;
        };

        instance.getRightBaseArm = function(angle) {
            var arm = new Arm(simulatorConstants.ARMLENGTH * 2 + 4 * 20, 0, angle, simulatorConstants.ARMLENGTH);
            return arm;
        };

        function onePlaybackStep() {
            if(playbackStrokes.length === 0) return;
            
            var stroke = playbackStrokes[playbackIndex++];
            strokePoints.push(stroke);
            
            globalLeftAngle = botEngine.determineBaseAngleFromPosition(stroke.point, instance.getLeftBaseArm(globalLeftAngle), true);
            globalRightAngle = botEngine.determineBaseAngleFromPosition(stroke.point, instance.getRightBaseArm(globalRightAngle), false);

            var leftBaseArm = instance.getLeftBaseArm(globalLeftAngle);
            var rightBaseArm = instance.getRightBaseArm(globalRightAngle);

            var leftEndPoint = servoEndPoint(leftBaseArm);
            var rightEndPoint = servoEndPoint(rightBaseArm);

            botDraw.clearCanvas();

            // Draw the base arms
            botDraw.drawLine(leftBaseArm.point, leftEndPoint, "#111111");
            botDraw.drawLine(rightBaseArm.point, rightEndPoint, "#00ff00");

            // Determine where connection, and draw top arms.
            var connectionPoint = positionOfConnection(leftEndPoint, leftBaseArm.length, rightEndPoint, rightBaseArm.length);

            botDraw.drawLine(leftEndPoint, connectionPoint, "#0000ff");
            botDraw.drawLine(rightEndPoint, connectionPoint, "#ff0000");

            botDraw.addTextAtPosition("  (" + Math.floor(connectionPoint.x) + "," + Math.floor(connectionPoint.y) + ")", stroke.point);

            if(stroke.draw) {
                botDraw.addOutputText("i102");
            } else {
                botDraw.addOutputText("i90");
            }

            addOutputAngleText(globalLeftAngle, globalRightAngle);

            botDraw.applyStrokes(strokePoints);

            if (playbackIndex < playbackStrokes.length) {
                setTimeout(onePlaybackStep, 100); // jshint ignore:line
            }
        }

        instance.playStrokes = function() {
            playbackStrokes = [];
            var jsonStrokes = simulatorDataService.getStrokesAsJSONArray();
            _.forEach(jsonStrokes, (stroke) =>{
                playbackStrokes.push(new Stroke(stroke.x, stroke.y, stroke.draw));
            });
            instance.clearStrokePoints();
            playbackIndex = 0;

            onePlaybackStep();
        };

        instance.whatTimeIsIt = function() {
            playbackStrokes = botDigitalClock.getTimeAsStrokes();
            instance.clearStrokePoints();
            playbackStrokes.push(new Stroke(310,190,false));
            playbackIndex = 0;

            onePlaybackStep();
        };

        instance.doMessage = function() {

            playbackStrokes = botCharGenerator.convertToStrokes(simulatorDataService.getMessage());
            instance.clearStrokePoints();
            playbackStrokes.push(new Stroke(310,190,false));
            playbackIndex = 0;

            onePlaybackStep();
        };

        return instance;
    }
})();