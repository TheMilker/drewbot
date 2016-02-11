(function() {
    'use strict';
    angular.module('em-drewbot').factory('fontCreationControlsService', fontCreationControlsService);

    function fontCreationControlsService() {

        var instance = {};
        var fontCreationControlsModel = {
            strokes: "",
            fontStrokes: "",
            response: "",
            message: "",
            isRecording: false
        };

        instance.getFontCreationControlsModel = () => {
            return fontCreationControlsModel;
        };

        instance.isRecording = () => {
            return fontCreationControlsModel.isRecording;
        };
        
        instance.setRecording = (isRecording) => {
            fontCreationControlsModel.isRecording = isRecording;
        };
        
        instance.getMessage = () => {
            return fontCreationControlsModel.message;  
        };
        
        instance.appendStroke = (stroke) => {
            var point = stroke.point;
            fontCreationControlsModel.strokes = fontCreationControlsModel.strokes + '{ "x": ' + Math.floor(point.x) + ', "y": ' + Math.floor(point.y) + ', "draw": ' + stroke.draw + ' },';
        };
        
        instance.getStrokesAsJSONArray = () => {
            if(endsWith(fontCreationControlsModel.strokes, ",")) {
                fontCreationControlsModel.strokes = fontCreationControlsModel.strokes.substring(0, fontCreationControlsModel.strokes.length - 1);
            }
            return JSON.parse("[" + fontCreationControlsModel.strokes + "]");
        };
        
        instance.clearStrokes = () => {
            fontCreationControlsModel.strokes = "";
        };
                
        instance.clearFontStrokes = () => {
            fontCreationControlsModel.fontStrokes = "";
        };
        
        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        
        return instance;
    }
})();