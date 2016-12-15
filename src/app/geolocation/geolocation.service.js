(function() {
    'use strict';

    angular
        .module('pbox.geolocation')
        .service('geolocationService', geolocationService);

    /** @ngInject */
    function geolocationService($q, GeolocationModel) {
        var service = this;

        service.init = init;
        service.currentLocation = currentLocation;

        var _currentLocation;

        //////////////////////////////

        function init() {
            /*return pboxApi.http({
            	method: confg.httpMethods.POST,
            	url: config.pboxAPI.JOBS,
            	data: job
            })
            .then(function(data) {
            	return new JobModel(data);
            });*/
            return $q.when(function() {
                _currentLocation = new GeolocationModel({
                	latitude: 20,
                	longitude: 44
                });
                return 'Initialized';
            }());
        }

        function currentLocation() {
            return $q.when(function() {
                return _currentLocation;
            }());
        }
    }
})();