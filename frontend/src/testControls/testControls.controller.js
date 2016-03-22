(function() {
    'use strict';
    angular.module('em-drewbot').controller('TestControlsController', TestControlsController);

    TestControlsController.$inject = ['arduinoService', 'testControlsService'];

    function TestControlsController(arduinoService, testControlsService) {
        var TestControlsVM = this;
        TestControlsVM.commandResponse = "";
        TestControlsVM.customCommand = "";
        TestControlsVM.testControlsModel = testControlsService.getTestControlsModel();
        TestControlsVM.clearCommands = testControlsService.clearCommands;

        TestControlsVM.left90 = () => sendCommand({
            servoId: 'l',
            servoPosition: 90
        });
        TestControlsVM.right90 = () => sendCommand({
            servoId: 'r',
            servoPosition: 90
        });
        TestControlsVM.lifter90 = () => sendCommand({
            servoId: 'i',
            servoPosition: 90
        });
        TestControlsVM.sendUserCommand = () => sendCommand({
            servoId: TestControlsVM.customCommand.substring(0,1),
            servoPosition: parseInt(TestControlsVM.customCommand.substring(1))
        });

        TestControlsVM.connectArduino = () => {
            arduinoService.connectArduino().success((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            }).error((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            });
        };

        function sendCommand(command) {
            arduinoService.sendCommand(command).success((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            }).error((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            });
        }

        TestControlsVM.sendCommands = () => {
            var commandsArray = testControlsService.getCommandsAsArray();
            arduinoService.sendCommands(commandsArray).success((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            }).error((data, status, headers, config) => {
                TestControlsVM.commandResponse = data;
            });
        };


    }
})();