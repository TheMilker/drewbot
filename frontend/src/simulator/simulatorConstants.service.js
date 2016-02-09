(function() {
    'use strict';
    angular.module('em-drewbot').factory("simulatorConstants", simulatorConstants);

    function simulatorConstants() {
        const ARM_LENGTH_MM = 50;
        const CANVAS_SCALE_FACTOR =  4;
        const ARM_LENGTH = ARM_LENGTH_MM * CANVAS_SCALE_FACTOR;
        const SEGMENT_LENGTH = ARM_LENGTH / 4;
        const DIGIT_OFFSET = SEGMENT_LENGTH * 1.5;
        const FIRST_CHAR_X = -2 * DIGIT_OFFSET;
        const SKEW_FACTOR = 0.05;
        
        return angular.copy({
            ARM_LENGTH: ARM_LENGTH,
            SEGMENT_LENGTH: SEGMENT_LENGTH,
            DIGIT_OFFSET: DIGIT_OFFSET,
            FIRST_CHAR_X: FIRST_CHAR_X,
            SKEW_FACTOR: SKEW_FACTOR
        });
    }
})();