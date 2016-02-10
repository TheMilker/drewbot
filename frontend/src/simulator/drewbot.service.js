(function() {
    'use strict';
    angular.module('em-drewbot').factory('drewbotService', drewbotService);

    drewbotService.$inject = ['drewbotEngineService', 'simulatorConstants', 'drewbotCanvasService','simulatorDataService', 'strokeService', 'Angle', 'Point', 'Stroke'];

    function drewbotService(drewbotEngineService, simulatorConstants, drewbotCanvasService, simulatorDataService, strokeService, Angle, Point, Stroke) {

        var instance = {};

        var globalLeftAngle = new Angle(125, true);
        var globalRightAngle = new Angle(75, true);

        var strokePoints = [];

        var playbackStrokes = [];
        var playbackIndex;

        instance.moveToMousePos = (canvas, evt, mouseDown) => {
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

        instance.update = () => {
            drewbotCanvasService.clearCanvas();
            var leftBaseArm = drewbotEngineService.getLeftBaseArm(globalLeftAngle);
            var rightBaseArm = drewbotEngineService.getRightBaseArm(globalRightAngle);
            draw(leftBaseArm, rightBaseArm);
        };

        function moveToPos(stroke, shitKeyDown) {
            var tempLeftAngle = drewbotEngineService.determineBaseAngleFromPosition(stroke.point, drewbotEngineService.getLeftBaseArm(globalLeftAngle), true);
            var tempRightAngle = drewbotEngineService.determineBaseAngleFromPosition(stroke.point, drewbotEngineService.getRightBaseArm(globalRightAngle), false);

            if(shitKeyDown || (!shitKeyDown && stroke.draw)) {
                if (!isNaN(tempLeftAngle.degrees) && !isNaN(tempRightAngle.degrees)) {
                    updatePosition(stroke);
                    strokePoints.push(stroke);
                    drewbotCanvasService.drawCircle(stroke.point, 15);
                } else {
                    instance.update();
                }
            } else {
                instance.update();
            }
            drewbotCanvasService.addTextAtPosition("  (" + stroke.point.x + "," + stroke.point.y + ")", stroke.point);
        }

        function updatePosition(positionStroke) {

            var positionPoint = positionStroke.point;

            if (isNaN(positionPoint.x) || isNaN(positionPoint.y)) {
                return;
            }

            globalLeftAngle = drewbotEngineService.determineBaseAngleFromPosition(positionPoint, drewbotEngineService.getLeftBaseArm(globalLeftAngle), true);
            globalRightAngle = drewbotEngineService.determineBaseAngleFromPosition(positionPoint, drewbotEngineService.getRightBaseArm(globalRightAngle), false);

            appendCommands(globalLeftAngle, globalRightAngle);
            simulatorDataService.appendStroke(positionStroke);

            instance.update();
        }

        function appendCommands(leftAngle, rightAngle) {
            simulatorDataService.appendCommand("L" + (180 - Math.floor(leftAngle.degrees)));
            simulatorDataService.appendCommand("R" + (180 - Math.floor(rightAngle.degrees)));
        }

        function servoEndPoint(arm) {
            var x = Math.cos(arm.angle.radians) * arm.length + arm.point.x;
            var y = Math.sin(arm.angle.radians) * arm.length + arm.point.y;
            return new Point(x, y);
        }

        function positionOfConnection(point1, p1Length, point2, p2Length) {

            var intersectionPoints = drewbotEngineService.circleIntersectionPoints(point1, p1Length, point2, p2Length);
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
            drewbotCanvasService.drawCharOutline({ "x": baseLeft.point.x, "y": simulatorConstants.ARM_LENGTH * 0.9 }, simulatorConstants.ARM_LENGTH * 0.5, simulatorConstants.ARM_LENGTH * 0.5);

            var leftEndPoint = servoEndPoint(baseLeft);
            var rightEndPoint = servoEndPoint(baseRight);

            // Draw the base arms
            drewbotCanvasService.drawLine(baseLeft.point, leftEndPoint, "#111111");
            drewbotCanvasService.drawLine(baseRight.point, rightEndPoint, "#00ff00");

            // Determine where connection, and draw top arms.
            var connectionPoint = positionOfConnection(leftEndPoint, baseLeft.length, rightEndPoint, baseRight.length);

            drewbotCanvasService.drawLine(leftEndPoint, connectionPoint, "#0000ff");
            drewbotCanvasService.drawLine(rightEndPoint, connectionPoint, "#ff0000");

            // If we're in drawing mode, draw the current set of points
            drewbotCanvasService.applyStrokes(strokePoints);

            // Add some text to help with debugging
            drewbotCanvasService.addTextAtPosition("  (" + Math.floor(connectionPoint.x) + "," + Math.floor(connectionPoint.y) + ")", connectionPoint);
            drewbotCanvasService.addTextAtPosition("  Left(" + Math.floor(baseLeft.angle.degrees) + "\u00B0)", baseLeft.point);
            drewbotCanvasService.addTextAtPosition("  Right(" + Math.floor(baseRight.angle.degrees) + "\u00B0)", baseRight.point);
        }        

        function onePlaybackStep() {
            if(playbackStrokes.length === 0) return;

            var stroke = playbackStrokes[playbackIndex++];
            strokePoints.push(stroke);

            globalLeftAngle = drewbotEngineService.determineBaseAngleFromPosition(stroke.point, drewbotEngineService.getLeftBaseArm(globalLeftAngle), true);
            globalRightAngle = drewbotEngineService.determineBaseAngleFromPosition(stroke.point, drewbotEngineService.getRightBaseArm(globalRightAngle), false);

            var leftBaseArm = drewbotEngineService.getLeftBaseArm(globalLeftAngle);
            var rightBaseArm = drewbotEngineService.getRightBaseArm(globalRightAngle);

            var leftEndPoint = servoEndPoint(leftBaseArm);
            var rightEndPoint = servoEndPoint(rightBaseArm);

            drewbotCanvasService.clearCanvas();

            // Draw the base arms
            drewbotCanvasService.drawLine(leftBaseArm.point, leftEndPoint, "#111111");
            drewbotCanvasService.drawLine(rightBaseArm.point, rightEndPoint, "#00ff00");

            // Determine where connection, and draw top arms.
            var connectionPoint = positionOfConnection(leftEndPoint, leftBaseArm.length, rightEndPoint, rightBaseArm.length);

            drewbotCanvasService.drawLine(leftEndPoint, connectionPoint, "#0000ff");
            drewbotCanvasService.drawLine(rightEndPoint, connectionPoint, "#ff0000");

            drewbotCanvasService.addTextAtPosition("  (" + Math.floor(connectionPoint.x) + "," + Math.floor(connectionPoint.y) + ")", stroke.point);

            if(stroke.draw) {
                simulatorDataService.appendCommand("i102");
            } else {
                simulatorDataService.appendCommand("i90");
            }

            appendCommands(globalLeftAngle, globalRightAngle);

            drewbotCanvasService.applyStrokes(strokePoints);

            if (playbackIndex < playbackStrokes.length) {
                setTimeout(onePlaybackStep, 100);
            }
        }

        instance.playStrokes = () => {
            playbackStrokes = [];
            var jsonStrokes = simulatorDataService.getStrokesAsJSONArray();
            _.forEach(jsonStrokes, (stroke) =>{
                playbackStrokes.push(new Stroke(stroke.x, stroke.y, stroke.draw));
            });
            instance.clearStrokePoints();
            playbackIndex = 0;

            onePlaybackStep();
        };

        instance.whatTimeIsIt = () => {
            playbackStrokes = strokeService.getTimeAsStrokes();
            instance.clearStrokePoints();
            playbackStrokes.push(new Stroke(310,190,false));
            playbackIndex = 0;

            onePlaybackStep();
        };

        instance.doMessage = () => {

            playbackStrokes = strokeService.convertToStrokes(simulatorDataService.getMessage());
            instance.clearStrokePoints();
            playbackStrokes.push(new Stroke(310,190,false));
            playbackIndex = 0;

            onePlaybackStep();
        };

        return instance;
    }
})();