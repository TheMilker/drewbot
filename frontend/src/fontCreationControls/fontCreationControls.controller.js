(function() {
    'use strict';
    angular.module('em-drewbot').controller('FontCreationControlsController', FontCreationControlsController);

    FontCreationControlsController.$inject = ['$http', 'drewbotService', 'simulatorDataService', 'strokeService'];

    function FontCreationControlsController($http, drewbotService, simulatorDataService, strokeService) {
        var fontCreationControlsVM = this;

        fontCreationControlsVM.response = "";
        fontCreationControlsVM.simulatorModel = simulatorDataService.getSimulatorModel(); //TODO break off font creation data into its own model/service
        fontCreationControlsVM.clearStrokes = simulatorDataService.clearStrokes;
        fontCreationControlsVM.clearFontStrokes = simulatorDataService.clearFontStrokes;

        fontCreationControlsVM.messageKeypress = (event) => {
           if (event.keyCode == 13) {
              fontCreationControlsVM.doMessage();
           }
        };

        fontCreationControlsVM.doMessage = () => {
            drewbotService.doMessage();
        };

        fontCreationControlsVM.whatTimeIsIt = () => {
            drewbotService.whatTimeIsIt();
        };

        fontCreationControlsVM.sendStrokes = () => {
            var JSONStrokes = simulatorDataService.getStrokesAsJSONArray();
            console.log("Recorded Strokes: ", JSONStrokes);
            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            }).error((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            });
        };

        fontCreationControlsVM.playStrokes = () => {
            drewbotService.playStrokes();
        };

        fontCreationControlsVM.makeFont = () => {
            var JSONStrokes = simulatorDataService.getStrokesAsJSONArray();
            JSONStrokes = strokeService.removeDuplicateStrokes(JSONStrokes);
            JSONStrokes = strokeService.removeExtraUpStokes(JSONStrokes);
            fontCreationControlsVM.simulatorModel.fontStrokes = JSON.stringify(JSONStrokes);
        };

        fontCreationControlsVM.sendFont = () => {
            var JSONStrokes = JSON.parse(fontCreationControlsVM.simulatorModel.fontStrokes);
            console.log("Font Strokes: ", JSONStrokes);
            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            }).error((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            });
        };

        fontCreationControlsVM.playFontStrokes = () => {
            //drewbotService.playStrokes(); TODO maybe playStrokes() takes the strokes as a parameter
        };

        fontCreationControlsVM.recordingClicked = () => {
            if(fontCreationControlsVM.simulatorModel.isRecording) {
                simulatorDataService.clearStrokesAndCommands();
                drewbotService.clearStrokePoints();
            }
        };
    }
})();