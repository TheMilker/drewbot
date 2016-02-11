(function() {
    'use strict';    
    angular.module('em-drewbot').directive('emDrewbotCanvas', emDrewbotCanvas);

    emDrewbotCanvas.$inject = ['drewbotService', 'fontCreationControlsService', 'drewbotCanvasService', 'testControlsService'];

    function emDrewbotCanvas(drewbotService, fontCreationControlsService, drewbotCanvasService, testControlsService) {
        var directive = {
            scope: {},
            templateUrl: 'drewbotCanvas/drewbotCanvas.html',
            replace: true,
            link: link,
            restrict: 'E',
        };
        return directive;
        
        function link($scope, canvasElement, attrs) {
            drewbotCanvasService.setCanvas(canvasElement[0]);
            
            var mouseDown = false;
            canvasElement.on('mousemove', (event) => {
                fontCreationControlsService.setRecording(event.shiftKey);
                drewbotService.moveToMousePos(canvasElement[0], event, mouseDown);
                $scope.$apply();
            });

            canvasElement.on('mousedown', (event) => {
                if(!event.shiftKey) {
                    fontCreationControlsService.clearStrokes();
                    testControlsService.clearCommands();
                    drewbotService.clearStrokePoints();
                    $scope.$apply();
                }
                mouseDown = true;
            });

            canvasElement.on('mouseup', (event) => {
                mouseDown = false;
            });

            drewbotService.update();
        }
    }
})();