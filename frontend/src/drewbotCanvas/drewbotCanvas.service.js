(function() {
    'use strict';
    angular.module('em-drewbot').factory('drewbotCanvasService', drewbotCanvasService);
    
    function drewbotCanvasService() {

        var instance = {};
        var canvasElement;
        
        instance.setCanvas = function(canvas) {
            canvasElement = canvas;
        };

        instance.clearCanvas = () => {
            var canvasContext = getCanvasContext();
            canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
        };

        instance.drawCharOutline = (basePoint, width, length) => {
            var canvasContext = getCanvasContext();
            canvasContext.beginPath();
            canvasContext.rect(basePoint.x, basePoint.y, width, length);
            canvasContext.lineWidth = 1;
            canvasContext.strokeStyle = '#003300';
            canvasContext.stroke();
        };

        instance.drawLine = (startPos, endPos, color) => {
            drawGeneralLine(startPos, endPos, color, 10);
        };

        instance.drawPoints = (points) => {
            if (points.length === 0) {
                return;
            }
            var canvasContext = getCanvasContext();
            canvasContext.strokeStyle = "green";
            canvasContext.beginPath();
            canvasContext.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                canvasContext.lineTo(points[i].x, points[i].y);
            }
            canvasContext.lineWidth = 10;
            canvasContext.stroke();
            canvasContext.closePath();
        };

        instance.addTextAtPosition = (text, position) => {
            var canvasContext = getCanvasContext();
            canvasContext.fillStyle = '#00f';
            canvasContext.font = 'italic 10px sans-serif';
            canvasContext.textBaseline = 'top';
            canvasContext.fillText(text, position.x, position.y);
        };

        instance.drawCircle = (point, length) => {
            var canvasContext = getCanvasContext();
            canvasContext.beginPath();
            canvasContext.arc(point.x, point.y, length, 0, 2 * Math.PI, false);
            canvasContext.lineWidth = 1;
            canvasContext.strokeStyle = '#003300';
            canvasContext.stroke();
        };

        instance.applyStrokes = (strokes) => {
            if (strokes.length === 0) {
                return;
            }
            var canvasContext = getCanvasContext();
            canvasContext.strokeStyle = "green";
            canvasContext.beginPath();
            canvasContext.moveTo(strokes[0].point.x, strokes[0].point.y);
            for (var i = 1; i < strokes.length; i++) {
                if (strokes[i].draw) {
                    canvasContext.lineTo(strokes[i].point.x, strokes[i].point.y);
                } else {
                    canvasContext.moveTo(strokes[i].point.x, strokes[i].point.y);
                }
            }
            canvasContext.lineWidth = 10;
            canvasContext.stroke();
            canvasContext.closePath();
        };        

        function drawGeneralLine(startPos, endPos, color, width) {
            var canvasContext = getCanvasContext();
            canvasContext.strokeStyle = color;
            canvasContext.beginPath();
            canvasContext.moveTo(startPos.x, startPos.y);
            canvasContext.lineTo(endPos.x, endPos.y);
            canvasContext.lineWidth = width;
            canvasContext.stroke();
            canvasContext.closePath();
        }
        
        function getCanvasContext() {
            return canvasElement.getContext("2d");
        }

      return instance;
   }
})();