angular.module('em-drewbot').factory('simulatorDataService', simulatorDataService);

function simulatorDataService() {

    var instance = {};
    var simulatorModel = {
        strokes: "",
        commands: "",
        fontStrokes: "",
        response: "",
        isRecording: false
    };

    instance.getSimulatorModel = () => {
        return simulatorModel;
    };

    instance.isRecording = () => {
        return simulatorModel.isRecording;
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