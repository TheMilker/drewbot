(function() {
    'use strict';
    //TODO: convert to component
    angular.module('em-drewbot').directive('emSimulator', emSimulator);

    function emSimulator() {
        var directive = {
            scope: {},
			templateUrl: 'simulator/simulator.html',
			controller: 'SimulatorController',
			controllerAs: 'simulatorVM'
        };
        return directive;
    }
})();