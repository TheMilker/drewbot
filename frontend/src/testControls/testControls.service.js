(function() {
    'use strict';
    angular.module('em-drewbot').factory('testControlsService', testControlsService);

    function testControlsService() {

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
            //TODO: map this ServoCommands
            return testControlsModel.commands.trim().split("\n");
        };

        instance.clearCommands = () => {
            testControlsModel.commands = "";
        };

        return instance;
    }
})();