(function() {
    'use strict';
    angular.module('em-drewbot').controller('DrewbotClientController', DrewbotClientController);

    function DrewbotClientController() {
        var DrewbotClientVM = this;
        DrewbotClientVM.showTestControls = true;
        DrewbotClientVM.showDrewbotCanvas = true;
        DrewbotClientVM.showFontCreationControls = true;
        
        DrewbotClientVM.toggleTestControls = () => {
            DrewbotClientVM.showTestControls = !DrewbotClientVM.showTestControls;
        };
        
        DrewbotClientVM.toggleDrewbotCanvas = () => {
            DrewbotClientVM.showDrewbotCanvas = !DrewbotClientVM.showDrewbotCanvas;
        };
        
        DrewbotClientVM.toggleFontCreationControls = () => {
            DrewbotClientVM.showFontCreationControls = !DrewbotClientVM.showFontCreationControls;
        };
    }
})();