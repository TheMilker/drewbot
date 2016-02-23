var erikFont = require('./erikFont');

function getFonts() {
    var fonts = {};
    fonts[erikFont.id] = erikFont;
    return fonts;
}

module.exports = {
    getFonts: getFonts
};