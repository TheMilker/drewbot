(function() {
    'use strict';
    angular.module('em-drewbot').factory('Stroke', StrokeFactory);

    StrokeFactory.$inject = ['Point'];

    function StrokeFactory(Point) {
        function Stroke(x, y, draw) {
            this.point = new Point(x, y);
            this.draw = draw;
            this.x = x;
            this.y = y;
        }
        return Stroke;
    }
})();