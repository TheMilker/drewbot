(function() {
    'use strict'; 
    angular.module('em-drewbot').controller('SimulatorController', SimulatorController);
    
    SimulatorController.$inject = ['$http', 'bot', 'simulatorDataService', 'sanitizationService'];
    
    function SimulatorController($http, bot, simulatorDataService, sanitizationService) {
        var simulatorVM = this;
        
        simulatorVM.simulatorModel = simulatorDataService.getSimulatorModel();
        simulatorVM.clearCommands = simulatorDataService.clearCommands;
        simulatorVM.clearStrokes = simulatorDataService.clearStrokes;
        simulatorVM.clearFontStrokes = simulatorDataService.clearFontStrokes;

        simulatorVM.sendCommands = () => {
            var commandsArray = simulatorVM.simulatorModel.commands.trim().split("\n");

            console.log("sending commands: ", commandsArray);

            $http.post('/commands', {commands: commandsArray}).success((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            }).error((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            });
        };

        simulatorVM.sendStrokes = () => {
            var JSONStrokes = simulatorDataService.getStrokesAsJSONArray();
            console.log("Recorded Strokes: ", JSONStrokes);
            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            }).error((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            });
        };
        
        simulatorVM.makeFont = () => {
            var JSONStrokes = simulatorDataService.getStrokesAsJSONArray();
            JSONStrokes = sanitizationService.removeDuplicateStrokes(JSONStrokes);
            JSONStrokes = sanitizationService.removeExtraUpStokes(JSONStrokes);
            simulatorVM.simulatorModel.fontStrokes = JSON.stringify(JSONStrokes);
        };
        
        simulatorVM.sendFont = () => {
            var JSONStrokes = JSON.parse(simulatorVM.simulatorModel.fontStrokes);
            console.log("Font Strokes: ", JSONStrokes);
            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            }).error((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            });
        };

        simulatorVM.recordingClicked = () => {
            if(simulatorVM.simulatorModel.isRecording) {
                simulatorDataService.clearStrokesAndCommands();
                bot.clearStrokePoints();
            }
        };

        simulatorVM.playStrokes = () => {
            bot.playStrokes();
        };

        simulatorVM.messageKeypress = (event) => {
           if (event.keyCode == 13) {
              simulatorVM.doMessage();
           }
        };

        simulatorVM.doMessage = () => {
            bot.doMessage();
        };

        simulatorVM.whatTimeIsIt = () => {
            bot.whatTimeIsIt();
        };
    }
})();