angular.module('em-drewbot').controller('TestControlsController', TestControlsController);

TestControlsController.$inject = ['$http'];

function TestControlsController($http) { 
    var viewModel = this; 
    viewModel.commandResponse ="";
    viewModel.customCommand = "";
    
    viewModel.left90 = () => sendCommand("l90\n");

    viewModel.right90 = () => sendCommand("r90\n");

    viewModel.lifter90 = () => sendCommand("i90\n");
    
    viewModel.connectArduino = () => {
        $http.post('/connectArduino').success((data, status, headers, config) => {
            viewModel.commandResponse = data;
        }).error((data, status, headers, config) => {
            viewModel.commandResponse = data;
        });
    };
    
    viewModel.sendCustomCommand = () => {
        if(!endsWith(viewModel.customCommand, "\n")) {
            viewModel.customCommand = viewModel.customCommand+"\n";
        }
        sendCommand(viewModel.customCommand);
    };

    function sendCommand(command) {
        $http.post('/command', {command: command}).success((data, status, headers, config) => {
            viewModel.commandResponse = data;
        }).error((data, status, headers, config) => {
            viewModel.commandResponse = data;
        });
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }
}