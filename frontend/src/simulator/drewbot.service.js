(function() {
    'use strict';
    angular.module('em-drewbot').factory('drewbotService', drewbotService);

    drewbotService.$inject = ['drewbotEngineService', 'simulatorConstants', 'drewbotCanvasService','fontCreationControlsService', 'strokeService', 'Angle', 'Point', 'Stroke', 'testControlsService', '$interval'];

    function drewbotService(drewbotEngineService, simulatorConstants, drewbotCanvasService, fontCreationControlsService, strokeService, Angle, Point, Stroke, testControlsService, $interval) {

        var instance = {};

        var globalLeftAngle = new Angle(125, true);
        var globalRightAngle = new Angle(75, true);

        var strokePoints = [];

        instance.moveToMousePos = (canvas, evt, mouseDown) => {
            var rect = canvas.getBoundingClientRect();
            var stroke = new Stroke(evt.clientX - rect.left, evt.clientY - rect.top, mouseDown);
            moveToPos(stroke, evt.shiftKey);
        };

        instance.clearStrokePoints = () => {
            strokePoints = [];
        };

        function moveToPos(stroke, shiftKeyDown) {
            var tempLeftAngle = drewbotEngineService.determineBaseAngleFromPosition(stroke.point, drewbotEngineService.getLeftBaseArm(globalLeftAngle), true);
            var tempRightAngle = drewbotEngineService.determineBaseAngleFromPosition(stroke.point, drewbotEngineService.getRightBaseArm(globalRightAngle), false);

            if(shiftKeyDown || (!shiftKeyDown && stroke.draw)) {
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
            
            updateGlobalAnglePositions(positionPoint, drewbotEngineService.getLeftBaseArm(globalLeftAngle), drewbotEngineService.getRightBaseArm(globalRightAngle));
            appendCommands(globalLeftAngle, globalRightAngle, positionStroke.draw);
            fontCreationControlsService.appendStroke(positionStroke);

            instance.update();
        }
        
        instance.update = () => {
            drewbotCanvasService.clearCanvas();
            draw();
        };

        function servoEndPoint(arm) {
            var x = Math.cos(arm.angle.radians) * arm.length + arm.point.x;
            var y = Math.sin(arm.angle.radians) * arm.length + arm.point.y;
            return new Point(x, y);
        }

        function positionOfConnection(point1, p1Length, point2, p2Length) {
            var intersectionPoints = drewbotEngineService.circleIntersectionPoints(point1, p1Length, point2, p2Length);            

            // Use max y - it should never buckle down
            var connectionPoint;
            if (intersectionPoints[1].y > intersectionPoints[0].y) {
                connectionPoint = intersectionPoints[1];
            } else {
                connectionPoint = intersectionPoints[0];
            }

            return connectionPoint;
        }

        function draw() {            
            var baseLeft = drewbotEngineService.getLeftBaseArm(globalLeftAngle);
            var baseRight = drewbotEngineService.getRightBaseArm(globalRightAngle);           
            
            // Add box for char size
            drewbotCanvasService.drawCharOutline({ "x": baseLeft.point.x, "y": simulatorConstants.ARM_LENGTH * 0.9 }, simulatorConstants.ARM_LENGTH * 0.5, simulatorConstants.ARM_LENGTH * 0.5);
            
            drawArms(baseLeft, baseRight);

            // If we're in drawing mode, draw the current set of points
            drewbotCanvasService.applyStrokes(strokePoints);

            // Add some text to help with debugging
            drewbotCanvasService.addTextAtPosition("  Left(" + Math.floor(baseLeft.angle.degrees) + "\u00B0)", baseLeft.point);
            drewbotCanvasService.addTextAtPosition("  Right(" + Math.floor(baseRight.angle.degrees) + "\u00B0)", baseRight.point);
        }
        
        function playbackStep(playBackInfo) {
            if(playBackInfo.strokes.length === 0) return;
            var stroke = playBackInfo.strokes[playBackInfo.playBackIndex++];
            playBackInfo.playBackStrokePoints.push(stroke);
            
            drewbotCanvasService.clearCanvas();
                        
            var baseLeft = drewbotEngineService.getLeftBaseArm(globalLeftAngle);
            var baseRight = drewbotEngineService.getRightBaseArm(globalRightAngle);            
            
            drawArms(baseLeft, baseRight);
            
            //record the arduino commands to the textarea
            updateGlobalAnglePositions(stroke.point, baseLeft, baseRight);
            appendCommands(globalLeftAngle, globalRightAngle, stroke.draw);
            
            //draw strokes
            drewbotCanvasService.applyStrokes(playBackInfo.playBackStrokePoints);
        }
        
        function drawArms(baseLeft, baseRight) {
            var leftEndPoint = servoEndPoint(baseLeft);
            var rightEndPoint = servoEndPoint(baseRight);
            // Draw the base arms
            drewbotCanvasService.drawLine(baseLeft.point, leftEndPoint, "#111111");
            drewbotCanvasService.drawLine(baseRight.point, rightEndPoint, "#00ff00");
            // Determine where connection,
            var connectionPoint = positionOfConnection(leftEndPoint, baseLeft.length, rightEndPoint, baseRight.length);
            // Draw top arms.
            drewbotCanvasService.drawLine(leftEndPoint, connectionPoint, "#0000ff");
            drewbotCanvasService.drawLine(rightEndPoint, connectionPoint, "#ff0000");
            // show coordinates at the connection point            
            drewbotCanvasService.addTextAtPosition("  (" + Math.floor(connectionPoint.x) + "," + Math.floor(connectionPoint.y) + ")", connectionPoint);
        }
        
        function updateGlobalAnglePositions(point, leftAngle, rightAngle) {
            globalLeftAngle = drewbotEngineService.determineBaseAngleFromPosition(point, leftAngle, true);
            globalRightAngle = drewbotEngineService.determineBaseAngleFromPosition(point, rightAngle, false);
        }
        
        function playBack(strokes) {
            instance.clearStrokePoints();
            var playBackInfo = {
                playBackIndex: 0,
                playBackStrokePoints: [],
                strokes: strokes
            };
            var intervalPromise = $interval(playbackStep, 100, strokes.length, true, playBackInfo);
            intervalPromise.finally(() => {
                strokePoints = playBackInfo.playBackStrokePoints;
                playBackInfo = {
                    playBackIndex: 0,
                    playBackStrokePoints: [],
                    strokes: strokes
                };
            });
        }    

        instance.simulateStrokes = (strokes) => {
            testControlsService.clearCommands();
            var newPlayBackStrokes = [];
            _.forEach(strokes, (stroke) =>{
                newPlayBackStrokes.push(new Stroke(stroke.x, stroke.y, stroke.draw));
            });
            playBack(newPlayBackStrokes);
        };

        instance.simulateCurrentTime = () => {
            testControlsService.clearCommands();
            instance.simulateStrokes(strokeService.getTimeAsStrokes());
        };       

        instance.simulateString = (str) => {
            testControlsService.clearCommands();
            instance.simulateStrokes(strokeService.convertToStrokes(str));
        };
        
        function appendCommands(leftAngle, rightAngle, shouldDraw) {
            if(shouldDraw) {
                testControlsService.appendCommand("i102");
            } else {
                testControlsService.appendCommand("i90");
            }
            testControlsService.appendCommand("L" + (180 - Math.floor(leftAngle.degrees)));
            testControlsService.appendCommand("R" + (180 - Math.floor(rightAngle.degrees)));
        }

        return instance;
    }
})();