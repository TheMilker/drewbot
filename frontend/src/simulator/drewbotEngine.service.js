(function() {
    'use strict';
    angular.module('em-drewbot').factory('drewbotEngineService', drewbotEngineService);

    drewbotEngineService.$inject = ['simulatorConstants', 'Angle', 'Point', 'Arm'];

    function drewbotEngineService(simulatorConstants, Angle, Point, Arm) {

        var instance = {};
        
        instance.getLeftBaseArm = (angle) => {
            var arm = new Arm(simulatorConstants.ARM_LENGTH * 2, 0, angle, simulatorConstants.ARM_LENGTH);
            return arm;
        };

        instance.getRightBaseArm = (angle) => {
            var arm = new Arm(simulatorConstants.ARM_LENGTH * 2 + 4 * 20, 0, angle, simulatorConstants.ARM_LENGTH);
            return arm;
        };

        instance.determineBaseAngleFromPosition = (pos, baseArm, isLeft) => {

            var points = instance.circleIntersectionPoints(baseArm.point, baseArm.length, pos, simulatorConstants.ARM_LENGTH);
            // Use the correct intersection point
            var x;
            var y;
            // If we're looking at left base, use left most intersection
            // If we're looking at not left base, use right most intersection
            if (points[0].x <= points[1].x && isLeft) {
                x = points[0].x;
                y = points[0].y;
            } else if (points[0].x >= points[1].x && !isLeft) {
                x = points[0].x;
                y = points[0].y;
            } else {
                x = points[1].x;
                y = points[1].y;
            }

            var result;
            if (x <= baseArm.point.x) {
                result = new Angle(Math.PI - Math.asin(y / baseArm.length), false);
            } else {
                result = new Angle(Math.asin(y / baseArm.length), false);
            }
            return result;
        };

        // Returns array of two intersection points.
        instance.circleIntersectionPoints = (p1, p1Length, p2, p2Length) => {
            // Stolen from:
            // http://ambrsoft.com/TrigoCalc/Circles2/Circle2.htm

            var connectionPoints = new Array(2);
            var a = p1.x;
            var b = p1.y;
            var c = p2.x;
            var d = p2.y;

            var D = Math.sqrt(Math.pow(c - a, 2) + Math.pow(d - b, 2));

            var delta = Math.sqrt((D + p1Length + p2Length) * (D + p1Length - p2Length) * (D - p1Length + p2Length) * (-D + p1Length + p2Length)) / 4.0;

            var xBase = (a + c) / 2.0 + (c - a) * (p2Length * p2Length - p1Length * p1Length) / (2.0 * D * D);
            var yBase = (b + d) / 2.0 + (d - b) * (p2Length * p2Length - p1Length * p1Length) / (2.0 * D * D);

            var x1 = xBase + 2 * (d - b) * delta / (D * D);
            var x2 = xBase - 2 * (d - b) * delta / (D * D);
            var y1 = yBase - 2 * (c - a) * delta / (D * D);
            var y2 = yBase + 2 * (c - a) * delta / (D * D);

            connectionPoints[0] = new Point(x1, y1);
            connectionPoints[1] = new Point(x2, y2);

            return connectionPoints;
        };

        return instance;
    }
})();