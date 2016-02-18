(function() {
    'use strict';
    angular.module('em-drewbot').factory('strokeService', strokeService);

    strokeService.$inject = ['drewbotEngineService', 'simulatorConstants', 'erikFontService', 'Stroke', 'Angle'];

    function strokeService(drewbotEngineService, simulatorConstants, erikFontService, Stroke, Angle) {
        
        var instance = {};
        
        var globalLeftAngle = new Angle(125, true);
        var globalRightAngle = new Angle(75, true);
        
        instance.convertToStrokes = (str) => {
            var offsetX = simulatorConstants.FIRST_CHAR_X;
            var strokes = [];
            var font = erikFontService.getFont();
            
            // _.each(str, (currentCharacter, index) => {
            //     console.log("currentCharacter: ", currentCharacter);
            //     var characterStrokes = font[currentCharacter+""];
                
                
            //     _.each(characterStrokes, (strokeData, index) => {
            //         strokes.push(new Stroke(strokeData.x + offsetX, strokeData.y, strokeData.draw));
            //     });
            //     strokes.push(new Stroke(currentCharacter[index-1].x + offsetX, currentCharacter[index-1].y, false));
            //     offsetX += simulatorConstants.DIGIT_OFFSET;
            // });

            for (var c = 0; c < str.length; c++) {
                var currentChar = font[str[c]];
                
                strokes.push(new Stroke(currentChar[0].x + offsetX, currentChar[0].y, false));
                for (var cc = 0; cc < currentChar.length; cc++ ) {
                    strokes.push(new Stroke(currentChar[cc].x + offsetX, currentChar[cc].y, currentChar[cc].draw));
                }
                strokes.push(new Stroke(currentChar[currentChar.length-1].x + offsetX, currentChar[currentChar.length-1].y, false));
                
                offsetX += simulatorConstants.DIGIT_OFFSET;
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