angular.module('em-drewbot').directive('emDrewbotCanvas', emDrewbotCanvas);

emDrewbotCanvas.$inject = ['bot', 'botDraw', 'simulatorDataService'];

function emDrewbotCanvas(bot, botDraw, simulatorDataService) {
    var directive = {
        scope: {},
        templateUrl: 'drewbotCanvas/drewbotCanvas.html',
        replace: true,
        link: link,
        restrict: 'E',
    };
    return directive;
    
    function link($scope, canvasElement, attrs) {
                
        var mouseDown = false;
        canvasElement.on('mousemove', (event) => {
            simulatorDataService.getSimulatorModel().isRecording = event.shiftKey;
            bot.moveToMousePos(canvasElement[0], event, mouseDown);
            $scope.$apply();
        });

        canvasElement.on('mousedown', (event) => {
            if(!event.shiftKey) {
                simulatorDataService.clearStrokesAndCommands();
                bot.clearStrokePoints();
                $scope.$apply();
            }
            mouseDown = true;
        });

        canvasElement.on('mouseup', (event) => {
            mouseDown = false;
        });

        bot.update();
    }
}