//TASK: this font is currently broken, might be fun to fix someday
(function() {
    'use strict';
    angular.module('em-drewbot').factory('digitalFontService', digitalFontService);

    digitalFontService.$inject = ['simulatorConstants', 'Point', 'Stroke'];

    function digitalFontService(simulatorConstants, Point, Stroke) {

        var instance = {};

        var digitalFont = {
            id: 'digital'
        };

        instance.getFont = () => {
            return digitalFont;
        };

        // the line segments are defined as.
        // 1 is the top line, 2 is center line, 3 is the bottom line
        // 4 is top left, 5 is top right
        // 6 is bottom left, 7 is bottom right
        // 8 indicates a colon character
        // 10 is upper left to middle, 11 is upper right to middle
        // 12 is lower left to middle, 13 is lower right to middle
        // 14 is top center, 15 is lower center
        // 16 is lower middle to left, 17 is lower middle to right
        var TOPLINESEGMENT = 1;
        var CENTERLINESEGMENT = 2;
        var BOTTOMLINESEGMENT = 3;
        var TOPLEFTSEGMENT = 4;
        var TOPRIGHTSEGMENT = 5;
        var BOTTOMLEFTSEGMENT = 6;
        var BOTTOMRIGHTSEGMENT = 7;
        var COLONSEGMENT = 8;
        var XTOPLEFTSEGMENT = 10;
        var XTOPRIGHTSEGMENT = 11;
        var XBOTTOMLEFTSEGMENT = 12;
        var XBOTTOMRIGHTSEGMENT = 13;
        var TOPCENTERSEGMENT = 14;
        var BOTTOMCENTERSEGMENT = 15;
        var VBOTTOMLEFTSEGMENT = 16;
        var VBOTTOMRIGHTSEGMENT = 17;

        _.forEach("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:", (letter) => {
            var segs = charToSegments(letter);
            var pointOffset = new Point(simulatorConstants.DIGIT_OFFSET, simulatorConstants.ARM_LENGTH);
            digitalFont[letter.toString()] = getSegmentStrokes(segs, pointOffset);
        });

        function shiftPoint(stroke, shift) {
            return new Stroke(stroke.point.x + shift.x, stroke.point.y + shift.y, stroke.draw);
        }

        function skew(point) {
            var skewPoint = new Point(-simulatorConstants.ARM_LENGTH * simulatorConstants.SKEW_FACTOR, 0);
            return shiftPoint(point, skewPoint);
        }

        function skew2(point) {
            return skew(skew(point));
        }

        function getSegmentStrokes(segments, shift) {
            var strokes = [];
            var lenFactor = 0.9;
            for (var i = 0; i < segments.length; i++) {
                var eachSegment = segments[i];

                switch (eachSegment) {
                    case TOPLINESEGMENT:
                        strokes.push(shiftPoint(new Stroke(0, 0, false), shift));
                        strokes.push(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH * lenFactor, 0, true), shift));
                        break;
                    case CENTERLINESEGMENT:
                        strokes.push(skew(shiftPoint(new Stroke(0, simulatorConstants.SEGMENT_LENGTH, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH * lenFactor, simulatorConstants.SEGMENT_LENGTH, true), shift)));
                        break;
                    case BOTTOMLINESEGMENT:
                        strokes.push(skew2(shiftPoint(new Stroke(0, simulatorConstants.SEGMENT_LENGTH * 2, false), shift)));
                        strokes.push(skew2(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH * lenFactor, simulatorConstants.SEGMENT_LENGTH * 2, true), shift)));
                        break;
                    case TOPLEFTSEGMENT:
                        strokes.push(shiftPoint(new Stroke(0, 0, false), shift));
                        strokes.push(skew(shiftPoint(new Stroke(0, simulatorConstants.SEGMENT_LENGTH * lenFactor, true), shift)));
                        break;
                    case TOPRIGHTSEGMENT:
                        strokes.push(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH, 0, false), shift));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH, simulatorConstants.SEGMENT_LENGTH * lenFactor, true), shift)));
                        break;
                    case BOTTOMLEFTSEGMENT:
                        strokes.push(skew(shiftPoint(new Stroke(0, simulatorConstants.SEGMENT_LENGTH, false), shift)));
                        strokes.push(skew2(shiftPoint(new Stroke(0, simulatorConstants.SEGMENT_LENGTH * 2 * lenFactor, true), shift)));
                        break;
                    case BOTTOMRIGHTSEGMENT:
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH, simulatorConstants.SEGMENT_LENGTH, false), shift)));
                        strokes.push(skew2(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH, simulatorConstants.SEGMENT_LENGTH * 2 * lenFactor, true), shift)));
                        break;
                    case COLONSEGMENT: // : colon char
                        strokes.push(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * 0.25, false), shift));
                        strokes.push(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * 0.25 + simulatorConstants.SEGMENT_LENGTH * 0.25, true), shift));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * 1.25, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * 1.25 + simulatorConstants.SEGMENT_LENGTH * 0.25, true), shift)));
                        break;
                    case XTOPLEFTSEGMENT:
                        strokes.push((shiftPoint(new Stroke(0, 0, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * lenFactor, true), shift)));
                        break;
                    case XTOPRIGHTSEGMENT:
                        strokes.push((shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH, 0, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * lenFactor, true), shift)));
                        break;
                    case XBOTTOMLEFTSEGMENT:
                        strokes.push(skew2(shiftPoint(new Stroke(0, simulatorConstants.SEGMENT_LENGTH * 2 * lenFactor, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH, true), shift)));
                        break;
                    case XBOTTOMRIGHTSEGMENT:
                        strokes.push(skew2(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH, simulatorConstants.SEGMENT_LENGTH * 2 * lenFactor, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH, true), shift)));
                        break;
                    case TOPCENTERSEGMENT:
                        strokes.push((shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, 0, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * lenFactor, true), shift)));
                        break;
                    case BOTTOMCENTERSEGMENT:
                        strokes.push(skew2(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * 2 * lenFactor, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH, true), shift)));
                        break;
                    case VBOTTOMLEFTSEGMENT:
                        strokes.push(skew2(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * 2 * lenFactor, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(0, simulatorConstants.SEGMENT_LENGTH, true), shift)));
                        break;
                    case VBOTTOMRIGHTSEGMENT:
                        strokes.push(skew2(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH / 2, simulatorConstants.SEGMENT_LENGTH * 2 * lenFactor, false), shift)));
                        strokes.push(skew(shiftPoint(new Stroke(simulatorConstants.SEGMENT_LENGTH, simulatorConstants.SEGMENT_LENGTH, true), shift)));
                        break;
                    default:
                        console.log("drawSegmentsAtPosition unknown " + eachSegment);
                }
            }
            return strokes;
        }

        function charToSegments(char) {

            var lineSegments;
            switch (char.toUpperCase()) {
            case '0':
                lineSegments = [TOPLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case '1':
                lineSegments = [TOPRIGHTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case '2':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT];
                break;
            case '3':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPRIGHTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case '4':
                lineSegments = [CENTERLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case '5':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case '6':
                lineSegments = [CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case '7':
                lineSegments = [TOPLINESEGMENT, TOPRIGHTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case '8':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case '9':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case ' ':
                lineSegments = [];
                break;
            case ':':
                lineSegments = [COLONSEGMENT];
                break;
            case 'A':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'B':
                lineSegments = [CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'C':
                lineSegments = [TOPLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, BOTTOMLEFTSEGMENT];
                break;
            case 'D':
                lineSegments = [CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'E':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, BOTTOMLEFTSEGMENT];
                break;
            case 'F':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, TOPLEFTSEGMENT, BOTTOMLEFTSEGMENT];
                break;
            case 'G':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'H':
                lineSegments = [CENTERLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'I':
                lineSegments = [TOPCENTERSEGMENT, BOTTOMCENTERSEGMENT];
                break;
            case 'J':
                lineSegments = [BOTTOMLINESEGMENT, TOPRIGHTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'K':
                lineSegments = [TOPCENTERSEGMENT, BOTTOMCENTERSEGMENT, XTOPRIGHTSEGMENT, XBOTTOMRIGHTSEGMENT];
                break;
            case 'L':
                lineSegments = [BOTTOMLINESEGMENT, TOPLEFTSEGMENT, BOTTOMLEFTSEGMENT];
                break;
            case 'M':
                lineSegments = [TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT, XTOPLEFTSEGMENT, XTOPRIGHTSEGMENT];
                break;
            case 'N':
                lineSegments = [TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT, XTOPLEFTSEGMENT, XBOTTOMRIGHTSEGMENT];
                break;
            case 'O':
                lineSegments = [TOPLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'P':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT];
                break;
            case 'Q':
                lineSegments = [TOPLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT, XBOTTOMRIGHTSEGMENT];
                break;
            case 'R':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, XBOTTOMRIGHTSEGMENT];
                break;
            case 'S':
                lineSegments = [TOPLINESEGMENT, CENTERLINESEGMENT, BOTTOMLINESEGMENT, TOPLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'T':
                lineSegments = [TOPLINESEGMENT, TOPCENTERSEGMENT, BOTTOMCENTERSEGMENT];
                break;
            case 'U':
                lineSegments = [BOTTOMLINESEGMENT, TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT];
                break;
            case 'V':
                lineSegments = [TOPLEFTSEGMENT, TOPRIGHTSEGMENT, VBOTTOMLEFTSEGMENT, VBOTTOMRIGHTSEGMENT];
                break;
            case 'W':
                lineSegments = [TOPLEFTSEGMENT, TOPRIGHTSEGMENT, BOTTOMLEFTSEGMENT, BOTTOMRIGHTSEGMENT, XBOTTOMLEFTSEGMENT, XBOTTOMRIGHTSEGMENT];
                break;
            case 'X':
                lineSegments = [XTOPLEFTSEGMENT, XTOPRIGHTSEGMENT, XBOTTOMLEFTSEGMENT, XBOTTOMRIGHTSEGMENT];
                break;
            case 'Y':
                lineSegments = [XTOPLEFTSEGMENT, XTOPRIGHTSEGMENT, BOTTOMCENTERSEGMENT];
                break;
            case 'Z':
                lineSegments = [TOPLINESEGMENT, BOTTOMLINESEGMENT, XTOPRIGHTSEGMENT, XBOTTOMLEFTSEGMENT];
                break;
            default:
                lineSegments = [2];
                console.log("Unexpected digit");
            // return question mark
            }
            return lineSegments;
        }

        return instance;
   }
})();