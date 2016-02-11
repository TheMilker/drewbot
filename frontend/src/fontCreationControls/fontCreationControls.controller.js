(function() {
    'use strict';
    angular.module('em-drewbot').controller('FontCreationControlsController', FontCreationControlsController);

    FontCreationControlsController.$inject = ['$http', 'drewbotService', 'fontCreationControlsService', 'strokeService'];

    function FontCreationControlsController($http, drewbotService, fontCreationControlsService, strokeService) {
        var fontCreationControlsVM = this;

        fontCreationControlsVM.response = "";
        fontCreationControlsVM.fontCreationControlsModel = fontCreationControlsService.getFontCreationControlsModel();
        fontCreationControlsVM.clearStrokes = fontCreationControlsService.clearStrokes;
        fontCreationControlsVM.clearFontStrokes = fontCreationControlsService.clearFontStrokes;

        fontCreationControlsVM.messageKeypress = (event) => {
           if (event.keyCode == 13) {
              fontCreationControlsVM.playMessage();
           }
        };

        fontCreationControlsVM.playMessage = () => {
            drewbotService.simulateString(fontCreationControlsVM.fontCreationControlsModel.message);
        };

        fontCreationControlsVM.simulateCurrentTime = () => {
            drewbotService.simulateCurrentTime();
        };

        fontCreationControlsVM.sendStrokes = () => {
            var JSONStrokes = fontCreationControlsService.getStrokesAsJSONArray();
            console.log("Recorded Strokes: ", JSONStrokes);
            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            }).error((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            });
        };

        fontCreationControlsVM.simulateStrokes = () => {
            drewbotService.simulateStrokes(fontCreationControlsService.getStrokesAsJSONArray());
        };

        fontCreationControlsVM.makeFont = () => {
            var JSONStrokes = fontCreationControlsService.getStrokesAsJSONArray();
            JSONStrokes = strokeService.removeDuplicateStrokes(JSONStrokes);
            JSONStrokes = strokeService.removeExtraUpStokes(JSONStrokes);
            fontCreationControlsVM.fontCreationControlsModel.fontStrokes = JSON.stringify(JSONStrokes);
        };

        fontCreationControlsVM.sendFont = () => {
            var JSONStrokes = JSON.parse(fontCreationControlsVM.fontCreationControlsModel.fontStrokes);
            console.log("Font Strokes: ", JSONStrokes);
            $http.post('/drawStrokes', {strokes: JSONStrokes}).success((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            }).error((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            });
        };

        fontCreationControlsVM.simulateFontStrokes = () => {
            drewbotService.simulateStrokes(JSON.parse(fontCreationControlsVM.fontCreationControlsModel.fontStrokes));
        };

        fontCreationControlsVM.recordingClicked = () => {
            if(fontCreationControlsService.isRecording()) {
                fontCreationControlsService.clearStrokes();
                drewbotService.clearStrokePoints();
            }
        };
    }
})();