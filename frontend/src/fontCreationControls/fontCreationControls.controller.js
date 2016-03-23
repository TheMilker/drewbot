(function() {
    'use strict';
    angular.module('em-drewbot').controller('FontCreationControlsController', FontCreationControlsController);

    FontCreationControlsController.$inject = ['arduinoService', 'drewbotService', 'fontCreationControlsService', 'strokeService'];

    function FontCreationControlsController(arduinoService, drewbotService, fontCreationControlsService, strokeService) {
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

        fontCreationControlsVM.sendMessage = () => {
            arduinoService.sendMessage(fontCreationControlsVM.fontCreationControlsModel.message).success((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            }).error((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            });
        };

        fontCreationControlsVM.simulateMessage = () => {
            drewbotService.simulateString(fontCreationControlsVM.fontCreationControlsModel.message);
        };

        fontCreationControlsVM.sendCurrentTime = () => {
            console.log("send current time");
            // drewbotService.sendCurrentTime();
        };

        fontCreationControlsVM.simulateCurrentTime = () => {
            drewbotService.simulateCurrentTime();
        };

        fontCreationControlsVM.sendStrokes = () => {
            var JSONStrokes = fontCreationControlsService.getStrokesAsJSONArray();
            if(JSONStrokes) {
                drawStrokes(JSONStrokes);
            }
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
            if(fontCreationControlsVM.fontCreationControlsModel.fontStrokes) {
                var JSONStrokes = JSON.parse(fontCreationControlsVM.fontCreationControlsModel.fontStrokes);
                drawStrokes(JSONStrokes);
            }
        };

        function drawStrokes(JSONStrokes) {
            arduinoService.drawStrokes(JSONStrokes).success((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            }).error((data, status, headers, config) => {
                fontCreationControlsVM.response = data;
            });
        }

        fontCreationControlsVM.simulateFontStrokes = () => {
            if(fontCreationControlsVM.fontCreationControlsModel.fontStrokes) {
                drewbotService.simulateStrokes(JSON.parse(fontCreationControlsVM.fontCreationControlsModel.fontStrokes));
            }
        };

        fontCreationControlsVM.recordingClicked = () => {
            if(fontCreationControlsService.isRecording()) {
                fontCreationControlsService.clearStrokes();
                drewbotService.clearStrokePoints();
            }
        };
    }
})();