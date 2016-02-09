(function() {
    'use strict';
    angular.module('em-drewbot').factory('drewbotCanvas', drewbotCanvas);

    function drewbotCanvas() {
        var canvas;
        var service = {
            get: get,
            set: set 
        };
        
        return service;

        function get() { 
            return canvas;
        }
        
        function set(_canvas) {
            canvas = _canvas;
        }
    }
})();