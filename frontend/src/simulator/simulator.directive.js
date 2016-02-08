(function() {
    'use strict';

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