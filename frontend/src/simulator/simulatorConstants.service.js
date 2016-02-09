(function() {
    'use strict';
    angular.module('em-drewbot').factory("simulatorConstants", simulatorConstants);

    function simulatorConstants() {
        const ARMLENGTH_MM = 50;
        const CANVASSCALEFACTOR =  4;
        
        return {
            ARMLENGTH: ARMLENGTH_MM * CANVASSCALEFACTOR
        };
    }
})();