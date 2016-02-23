(function() {
    'use strict';
    angular.module('em-drewbot').factory('strokeService', strokeService);

    strokeService.$inject = ['drewbotEngineService', 'simulatorConstants', 'fontService', 'Stroke', 'Angle'];

    function strokeService(drewbotEngineService, simulatorConstants, fontService, Stroke, Angle) {
        
        var instance = {};
        var fonts;
        fontService.getFonts().then((_fonts) => {
            fonts = _fonts;
        }).catch((reason) => {
            console.log("getFonts failed: ", reason);
        });
        
        var globalLeftAngle = new Angle(125, true);
        var globalRightAngle = new Angle(75, true);
        
        instance.convertToStrokes = (str) => {
            var offsetX = simulatorConstants.FIRST_CHAR_X;
            var strokes = [];
            
            if(fonts && fonts.erik) {
                var font = fonts.erik;
                
                _.each(str, (currentCharacter, index) => {
                    var characterStrokes = font[currentCharacter.toString()];
                    strokes.push(new Stroke(characterStrokes[0].x + offsetX, characterStrokes[0].y, false));
                    _.each(characterStrokes, (strokeData) => {
                        strokes.push(new Stroke(strokeData.x + offsetX, strokeData.y, strokeData.draw));
                    });
                    strokes.push(new Stroke(currentCharacter[currentCharacter.length-1].x + offsetX, currentCharacter[currentCharacter.length-1].y, false));
                    offsetX += simulatorConstants.DIGIT_OFFSET;
                });
            }
            return strokes;
        };
        
        instance.getTimeAsStrokes = () => {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
        
            var hoursString = "";            
            if (hours < 10) {
                hoursString = "0" + hours;
            } else {
                hoursString = hours.toString();
            }
            var minutesString = "";
            if (minutes < 10) {
                minutesString = "0" + minutes;
            } else {
                minutesString = minutes.toString();
            }
        
            var timeString = hoursString + ":" + minutesString;
        
            return instance.convertToStrokes(timeString);
        };
        
        instance.removeDuplicateStrokes = (strokes) => {
            var sanitizedStrokes = [];
            var lastStrokeCommands;
            _.each(strokes, (stroke, index) => {
                var strokeCommands = getStrokeCommands(stroke);
                if(!angular.equals(lastStrokeCommands, strokeCommands)) {
                    sanitizedStrokes.push(stroke);
                }
                lastStrokeCommands = angular.copy(strokeCommands);
            });
            return sanitizedStrokes;
        };

        function getStrokeCommands(stroke) {
            globalLeftAngle = drewbotEngineService.determineBaseAngleFromPosition(stroke, drewbotEngineService.getLeftBaseArm(globalLeftAngle), true);
            globalRightAngle = drewbotEngineService.determineBaseAngleFromPosition(stroke, drewbotEngineService.getRightBaseArm(globalRightAngle), false);

            var commands = {};
            if(stroke.draw) {
                commands.i = "i102"; //down
            } else {
                commands.i = "i90"; //up
            }
            commands.l = "l" + (180 - Math.floor(globalLeftAngle.degrees));
            commands.r = "r" + (180 - Math.floor(globalRightAngle.degrees));
            return commands;
        }

        instance.removeExtraUpStokes = (strokes) => {
            var sanitizedStrokes = [];
            _.each(strokes, (stroke, index) => {
                var lastStroke = getLastStroke(strokes, index);
                var nextStroke = getNextStroke(strokes, index);
                if(lastStroke && lastStroke.draw === false && stroke.draw === false && nextStroke && nextStroke.draw === false) {
                    //do nothing
                } else {
                    sanitizedStrokes.push(stroke);
                }
            });
            return sanitizedStrokes;
        };

        function getLastStroke(strokes, currentIndex) {
            if(currentIndex === 0) {
                return null;
            } else {
                return strokes[currentIndex-1];
            }
        }

        function getNextStroke(strokes, currentIndex) {
            if(currentIndex === strokes.length-1) {
                return null;
            } else {
                return strokes[currentIndex+1];
            }
        }

        return instance;
    }
})();