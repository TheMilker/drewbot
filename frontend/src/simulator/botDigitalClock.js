(function() {
    'use strict';
    angular.module('em-drewbot').factory('botDigitalClock', botDigitalClock);
    
    botDigitalClock.$inject = ['strokeService'];
    
    function botDigitalClock(strokeService) {

        var instance = {};
        
        instance.getTimeAsStrokes = function() {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
        
            if (hours < 10) {
                hours = "0" + hours;
            } else {
                hours = hours.toString();
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            } else {
                minutes = minutes.toString();
            }
        
            var timeString = hours + ":" + minutes;
        
            return strokeService.convertToStrokes(timeString, "digital");
        };
        
        return instance;
    }
})();