(function() {
    'use strict';
    angular.module('em-drewbot').factory('simulatorDataService', simulatorDataService);

    function simulatorDataService() {

        var instance = {};
        var simulatorModel = {
            strokes: "",
            commands: "",
            fontStrokes: "",
            response: "",
            message: "",
            isRecording: false
        };

        instance.getSimulatorModel = () => {
            return simulatorModel;
        };

        instance.isRecording = () => {
            return simulatorModel.isRecording;
        };
        
        instance.getMessage = () => {
            return simulatorModel.message;  
        };
        
        instance.appendStroke = (stroke) => {
            var point = stroke.point;
            simulatorModel.strokes = simulatorModel.strokes + '{ "x": ' + Math.floor(point.x) + ', "y": ' + Math.floor(point.y) + ', "draw": ' + stroke.draw + ' },';
        };
        
        instance.getStrokesAsJSONArray = () => {
            if(endsWith(simulatorModel.strokes, ",")) {
                simulatorModel.strokes = simulatorModel.strokes.substring(0, simulatorModel.strokes.length - 1);
            }
            return JSON.parse("[" + simulatorModel.strokes + "]");
        };
        
        instance.appendCommand = (command) => {
            simulatorModel.commands = simulatorModel.commands + command + '\n';
        };
        
        instance.getCommandsAsArray = () => {
            return simulatorModel.commands.trim().split("\n");
        };

        instance.clearModel = () => {
            instance.clearStrokes();
            instance.clearCommands();
            simulatorModel.fontStrokes = "";
            simulatorModel.response = "";
            simulatorModel.isRecording = false;
        };

        instance.clearStrokesAndCommands = () => {
            instance.clearStrokes();
            instance.clearCommands();
        };
        
        instance.clearStrokes = () => {
            simulatorModel.strokes = "";
        };
        
        instance.clearCommands = () => {
            simulatorModel.commands = "";
        };
        
        instance.clearFontStrokes = () => {
            simulatorModel.fontStrokes = "";
        };
        
        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        
        return instance;
    }
})();