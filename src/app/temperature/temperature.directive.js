(function () {
    'use strict';

    angular
        .module('pbox.temperature')
        .directive('temperature', temperatureDirective);

    /** @ngInject */
    function temperatureDirective($q, $rootScope) {

        return {
            restrict: 'E',
            link: link,
            replace: true,
            templateUrl: 'app/temperature/temperature.html',
            scope: {
                tempHum: '='
            }
        };

        function link(scope, element, attrs) {

            scope.image = null;
            scope.temp = null;

            (function activate() {
                subscribeOnTemperatureChange();
            } ());

            function subscribeOnTemperatureChange() {
                
                scope.$watch('tempHum', function () {
                    
                    if (!!scope.tempHum) {
                        
                        scope.temp = parseInt(scope.tempHum.temperature);

                        if (scope.temp <= 15) {
                            scope.image = 'cold';
                        }

                        if (scope.temp > 15 && scope.temp <= 30) {
                            scope.image = 'warm';
                        }

                        if (scope.temp > 30) {
                            scope.image = 'hot';
                        }
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    }
                }, true);
            }
        }
    }
})();