const PointFactory = require('./PointFactory');

exports.Arm = (x, y, angle, length) => {
    return {
        point: PointFactory.Point(x, y),
        length: length,
        angle: angle
    };
};