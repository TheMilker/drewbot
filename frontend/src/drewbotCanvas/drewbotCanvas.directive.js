(function() {
    'use strict';    
    angular.module('em-drewbot').directive('emDrewbotCanvas', emDrewbotCanvas);

    emDrewbotCanvas.$inject = ['drewbotService', 'simulatorDataService', 'drewbotCanvasService'];

    function emDrewbotCanvas(drewbotService, simulatorDataService, drewbotCanvasService) {
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
                simulatorDataService.getSimulatorModel().isRecording = event.shiftKey;
                drewbotService.moveToMousePos(canvasElement[0], event, mouseDown);
                $scope.$apply();
            });

            canvasElement.on('mousedown', (event) => {
                if(!event.shiftKey) {
                    simulatorDataService.clearStrokesAndCommands();
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