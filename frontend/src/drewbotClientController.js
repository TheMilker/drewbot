angular.module('em-drewbot').controller('DrewbotClientController', ['$http',
    function($http) {
        var self = this;
        self.model = {
            commandResponse: "",
            customCommand: ""
        };

        this.left90 = () => sendCommand("l90\n");

        this.right90 = () => sendCommand("r90\n");

        this.lifter90 = () => sendCommand("i90\n");

        this.sendCustomCommand = () => {
            if(!endsWith(self.model.customCommand, "\n")) {
                self.model.customCommand = self.model.customCommand+"\n";
            }
            sendCommand(self.model.customCommand);
        };

        this.connectArduino = () => {
            $http.post('/connectArduino').success(function(data, status, headers, config) {
                self.model.commandResponse = data;
            }).error(function(data, status, headers, config) {
                self.model.commandResponse = data;
            });
        };

        function sendCommand(command) {
            $http.post('/command', {command: command}).success(function(data, status, headers, config) {
                self.model.commandResponse = data;
            }).error(function(data, status, headers, config) {
                self.model.commandResponse = data;
            });
        }

        function endsWith(str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
    }
]);