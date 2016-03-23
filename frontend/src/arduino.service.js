(function() {
'use strict';

    angular.module('em-drewbot').factory('arduinoService', arduinoService);

    arduinoService.$inject = ['$http'];
    function arduinoService($http) {
        var instance = {};

        instance.sendCommand = (command) => {
            console.log("sendCommand: ", command);
            return $http.post('/command', {command: command});
        };

        instance.sendCommands = (commandsArray) => {
            console.log("sendCommands: ", commandsArray);
            return $http.post('/commands', {commands: commandsArray});
        };

        instance.connectArduino = () => {
            console.log("connectArduino: ");
            return $http.post('/connectArduino');
        };

        instance.drawStrokes = (JSONStrokes) => {
            console.log("drawStrokes: ", JSONStrokes);
            return $http.post('/drawStrokes', {strokes: JSONStrokes});
        };

        instance.sendMessage = (message) => {
            console.log("sendMessage: ", message);
            return $http.post('/drawCharacters', {message: message});
        };

        return instance;
    }
})();