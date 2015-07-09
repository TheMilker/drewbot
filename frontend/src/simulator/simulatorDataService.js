angular.module('em-drewbot').factory('simulatorDataService', [
    function() {

        var instance = {};
        var simulatorModel = {
            strokes: "",
            commands: "",
            response: "",
            commandCount: 0
        };

        instance.getSimulatorModel = function() {
            return simulatorModel;
        };

        instance.clearModel = function() {
            simulatorModel = {
                strokes: "",
                commands: "",
                response: "",
                commandCount: 0
            };
        };

        return instance;
    }]
);