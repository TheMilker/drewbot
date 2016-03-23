exports.Angle = (value, isDegrees) => {
    var degrees;
    var radians;
    if (isDegrees) {
        degrees = value;
        radians = value * (Math.PI / 180.0);
    } else {
        radians = value;
        degrees = value * (180.0 / Math.PI);
    }
    
    return {
        degrees: degrees,
        radians: radians
    };
};