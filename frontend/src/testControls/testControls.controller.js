(function() {
    'use strict';
    angular.module('em-drewbot').controller('TestControlsController', TestControlsController);

    TestControlsController.$inject = ['$http', 'simulatorDataService'];

    function TestControlsController($http, simulatorDataService) {
        var TestControlsVM = this;
        TestControlsVM.commandResponse = "";
        TestControlsVM.customCommand = "";
        TestControlsVM.simulatorModel = simulatorDataService.getSimulatorModel();
        TestControlsVM.clearCommands = simulatorDataService.clearCommands; //TODO rename testControls to arduinoTestControls

        TestControlsVM.left90 = () => sendCommand("l90\n");

        TestControlsVM.right90 = () => sendCommand("r90\n");

        TestControlsVM.lifter90 = () => sendCommand("i90\n");

        TestControlsVM.connectArduino = () => {
            $http.post('/connectArduino').success((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            }).error((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            });
        };

        TestControlsVM.sendCustomCommand = () => {
            if(!endsWith(TestControlsVM.customCommand, "\n")) {
                TestControlsVM.customCommand = TestControlsVM.customCommand+"\n";
            }
            sendCommand(TestControlsVM.customCommand);
        };

        function sendCommand(command) {
            $http.post('/command', {command: command}).success((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            }).error((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            });
        }

        TestControlsVM.sendCommands = () => {
            var commandsArray = simulatorDataService.getCommandsAsArray();
            console.log("sending commands: ", commandsArray);
            $http.post('/commands', {commands: commandsArray}).success((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            }).error((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            });
        };

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
    }
})();