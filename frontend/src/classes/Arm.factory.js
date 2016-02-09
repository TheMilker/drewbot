(function() {
    'use strict';
    angular.module('em-drewbot').factory('Arm', ArmFactory);

    ArmFactory.$inject = ['Point'];

    function ArmFactory(Point) {
        function Arm(x, y, angle, length) {
            this.point = new Point(x, y);
            this.length = length;
            this.angle = angle;
        }
        return Arm;
    }
})();