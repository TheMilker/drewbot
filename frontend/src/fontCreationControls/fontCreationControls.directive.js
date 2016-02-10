(function() {
    'use strict';
    //TODO: convert to component
    angular.module('em-drewbot').directive('emFontCreationControls', emFontCreationControls);

    function emFontCreationControls() {
        var directive = {
            scope: {},
			templateUrl: 'fontCreationControls/fontCreationControls.html',
			controller: 'FontCreationControlsController',
			controllerAs: 'fontCreationControlsVM'
        };
        return directive;
    }
})();