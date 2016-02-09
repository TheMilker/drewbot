(function() {
    'use strict';
    angular.module('em-drewbot').factory('Point', PointFactory);

    function PointFactory() {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }
})();