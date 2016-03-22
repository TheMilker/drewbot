(function() {
    'use strict';
    angular.module('em-drewbot').factory('testControlsService', testControlsService);

    testControlsService.$inject = ['_'];

    function testControlsService(_) {

        var instance = {};
        var testControlsModel = {
            commands: ""
        };

        instance.getTestControlsModel = () => {
            return testControlsModel;
        };
        instance.appendCommand = (command) => {
            testControlsModel.commands = testControlsModel.commands + command + '\n';
        };

        instance.getCommandsAsArray = () => {
            var commandsArray = testControlsModel.commands.trim().split("\n");
            var servoCommands = _.map(commandsArray, (command) => {
                return {
                    servoId: command.substring(0,1),
                    servoPosition: parseInt(command.substring(1))
                };
            });
            return servoCommands;
        };

        instance.clearCommands = () => {
            testControlsModel.commands = "";
        };

        return instance;
    }
})();