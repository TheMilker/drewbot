(function() {
    'use strict';
    angular.module('em-drewbot').factory('Angle', AngleFactory);

    function AngleFactory() {
        function Angle(value, isDegrees) {
            if (isDegrees) {
                this.degrees = value;
                this.radians = value * (Math.PI / 180.0);
            } else {
                this.radians = value;
                this.degrees = value * (180.0 / Math.PI);
            }
        }
        return Angle;
    }
})();