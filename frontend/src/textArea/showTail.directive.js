(function() {
    'use strict';    
    angular.module('em-drewbot').directive('showTail', showTail);

    function showTail() {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;
        
        function link($scope, textArea, attrs) {
            $scope.$watch(() => {
                return textArea[0].value;
            },
            (e) => {
                textArea[0].scrollTop = textArea[0].scrollHeight;
            });
        }
    }
})();