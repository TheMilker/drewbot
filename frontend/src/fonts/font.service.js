(function() {
    'use strict';
    angular.module('em-drewbot').factory('fontService', fontService);

    fontService.$inject = ['$http', '$q'];
    function fontService($http, $q) {
        let instance = {};
        
        let fontDefer = $q.defer();
        
        instance.getFonts = () => {
            $http.get('/fonts').then((response) => {
                fontDefer.resolve(response.data);
            }).catch((response) => {
                fontDefer.resolve({});
            });
            return fontDefer.promise;            
        };
        
        return instance;
    }
})();