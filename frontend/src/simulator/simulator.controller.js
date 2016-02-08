angular.module('em-drewbot').controller('SimulatorController', ['$http', 'bot', 'simulatorDataService', 'sanitizationService',
    function($http, bot, simulatorDataService, sanitizationService) {
        var simulatorVM = this;
        
        simulatorVM.simulatorModel = simulatorDataService.getSimulatorModel();
        simulatorVM.clearCommands = simulatorDataService.clearCommands;
        simulatorVM.clearStrokes = simulatorDataService.clearStrokes;
        simulatorVM.clearFontStrokes = simulatorDataService.clearFontStrokes;

        simulatorVM.getCommandCount = () => {
            return simulatorVM.simulatorModel.commands.split("\n").length - 1;
        };

        simulatorVM.sendCommands = () => {
            var commandsArray = simulatorVM.simulatorModel.commands.trim().split("\n");

            console.log("commands: ", commandsArray);

            $http.post('/commands', {commands: commandsArray}).success((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            }).error((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            });
        };

        simulatorVM.sendStrokes = () => {
            if(endsWith(simulatorVM.simulatorModel.strokes, ",")) {
                simulatorVM.simulatorModel.strokes = simulatorVM.simulatorModel.strokes.substring(0, simulatorVM.simulatorModel.strokes.length - 1);
            }
            var JSONStrokes = JSON.parse("[" + simulatorVM.simulatorModel.strokes + "]");

            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            }).error((data, status, headers, config) => {
                simulatorVM.simulatorModel.response = data;
            });
        };

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        
        simulatorVM.makeFont = () => {
            if(endsWith(simulatorVM.simulatorModel.strokes, ",")) {
                simulatorVM.simulatorModel.strokes = simulatorVM.simulatorModel.strokes.substring(0, simulatorVM.simulatorModel.strokes.length - 1);
            }
            var JSONStrokes = JSON.parse("[" + simulatorVM.simulatorModel.strokes + "]");
            JSONStrokes = sanitizationService.removeDuplicateStrokes(JSONStrokes);
            JSONStrokes = sanitizationService.removeExtraUpStokes(JSONStrokes);
            simulatorVM.simulatorModel.fontStrokes = JSON.stringify(JSONStrokes);
        };
        
        simulatorVM.sendFont = () => {
            var JSONStrokes = JSON.parse(simulatorVM.simulatorModel.fontStrokes);
            console.log("JSONStrokes: ", JSONStrokes);
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

        simulatorVM.playback = () => {
            bot.playback();
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
]);