(function() {
    'use strict'; 
    angular.module('em-drewbot').controller('SimulatorController', SimulatorController);
    
    SimulatorController.$inject = ['$http', 'drewbotService', 'simulatorDataService', 'strokeService'];
    
    function SimulatorController($http, drewbotService, simulatorDataService, strokeService) {
        var simulatorVM = this;
        
        simulatorVM.response = "";        
        simulatorVM.simulatorModel = simulatorDataService.getSimulatorModel();
        simulatorVM.clearCommands = simulatorDataService.clearCommands;
        simulatorVM.clearStrokes = simulatorDataService.clearStrokes;
        simulatorVM.clearFontStrokes = simulatorDataService.clearFontStrokes;
        
        simulatorVM.sendCommands = () => {
            var commandsArray = simulatorDataService.getCommandsAsArray();
            console.log("sending commands: ", commandsArray);
            $http.post('/commands', {commands: commandsArray}).success((data, status, headers, config) => {
                simulatorVM.response = data;
            }).error((data, status, headers, config) => {
                simulatorVM.response = data;
            });
        };

        simulatorVM.sendStrokes = () => {
            var JSONStrokes = simulatorDataService.getStrokesAsJSONArray();
            console.log("Recorded Strokes: ", JSONStrokes);
            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                simulatorVM.response = data;
            }).error((data, status, headers, config) => {
                simulatorVM.response = data;
            });
        };
        
        simulatorVM.makeFont = () => {
            var JSONStrokes = simulatorDataService.getStrokesAsJSONArray();
            JSONStrokes = strokeService.removeDuplicateStrokes(JSONStrokes);
            JSONStrokes = strokeService.removeExtraUpStokes(JSONStrokes);
            simulatorVM.simulatorModel.fontStrokes = JSON.stringify(JSONStrokes);
        };
        
        simulatorVM.sendFont = () => {
            var JSONStrokes = JSON.parse(simulatorVM.simulatorModel.fontStrokes);
            console.log("Font Strokes: ", JSONStrokes);
            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                simulatorVM.response = data;
            }).error((data, status, headers, config) => {
                simulatorVM.response = data;
            });
        };

        simulatorVM.recordingClicked = () => {
            if(simulatorVM.simulatorModel.isRecording) {
                simulatorDataService.clearStrokesAndCommands();
                drewbotService.clearStrokePoints();
            }
        };

        simulatorVM.playStrokes = () => {
            drewbotService.playStrokes();
        };

        simulatorVM.messageKeypress = (event) => {
           if (event.keyCode == 13) {
              simulatorVM.doMessage();
           }
        };

        simulatorVM.doMessage = () => {
            drewbotService.doMessage();
        };

        simulatorVM.whatTimeIsIt = () => {
            drewbotService.whatTimeIsIt();
        };
    }
})();