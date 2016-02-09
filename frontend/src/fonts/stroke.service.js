(function() {
    'use strict';
    angular.module('em-drewbot').factory('strokeService', strokeService);

    strokeService.$inject = ['simulatorConstants', 'erikFontService', 'digitalFontService'];
    
    function strokeService(simulatorConstants, erikFontService, digitalFontService) {
        var instance = { };
        
        function getFont(fontId) {
            if(erikFontService.getFont().id === fontId) {
                return erikFontService.getFont();
            } else if(digitalFontService.getFont().id === fontId) {
                return digitalFontService.getFont();
            } else {
                return erikFontService.getFont();
            }
        }
        
        instance.convertToStrokes = (str, fontId) => {
            var offsetX = simulatorConstants.FIRST_CHAR_X;
            var strokes = [];
            var font = getFont(fontId);

            for (var c = 0; c < str.length; c++) {
                console.log("str[c]: ", str[c]);
                var currentChar = font[str[c]];

                for (var cc = 0; cc < currentChar.length; cc++ ) {
                    strokes.push(new Stroke(currentChar[cc].x + offsetX, currentChar[cc].y, cc !== 0));
                }
                strokes.push(new Stroke(currentChar[cc-1].x + offsetX, currentChar[cc-1].y, false));
                offsetX += simulatorConstants.DIGIT_OFFSET;
            }

            return strokes;
        };
        
        return instance;
    }
})();