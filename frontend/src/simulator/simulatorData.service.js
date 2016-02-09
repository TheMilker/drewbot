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
        
        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }

        instance.getSimulatorModel = () => {
            return simulatorModel;
        };

        instance.isRecording = () => {
            return simulatorModel.isRecording;
        };
        
        instance.getMessage = () => {
        return simulatorModel.message;  
        };
        
        instance.getStrokesAsJSONArray = () => {
            if(endsWith(simulatorModel.strokes, ",")) {
                simulatorModel.strokes = simulatorModel.strokes.substring(0, simulatorModel.strokes.length - 1);
            }
            return JSON.parse("[" + simulatorModel.strokes + "]");
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
        
        return instance;
    }
})();