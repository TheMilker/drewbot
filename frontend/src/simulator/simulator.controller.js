(function() {
    'use strict'; 
    angular.module('em-drewbot').controller('SimulatorController', SimulatorController);
    
    SimulatorController.$inject = ['$http', 'drewbotService', 'simulatorDataService', 'strokeService'];
    
    function SimulatorController($http, drewbotService, simulatorDataService, strokeService) {
        var simulatorVM = this;
        
        simulatorVM.response = "";        
        simulatorVM.simulatorModel = simulatorDataService.getSimulatorModel();
        simulatorVM.clearCommands = simulatorDataService.clearCommands; //TODO Move command/message stuff to be part of the testControls, rename testControls to arduinoTestControls
        
        simulatorVM.messageKeypress = (event) => {
           if (event.keyCode == 13) {
              simulatorVM.doMessage();
           }
        };

        simulatorVM.doMessage = () => {
            drewbotService.doMessage();
        };

        simulatorVM.whatTimeIsIt = () => {
            drewbotService.whatTimeIsIt();
        };
    }
})();