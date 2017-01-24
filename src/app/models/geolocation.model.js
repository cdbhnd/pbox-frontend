(function () {
    'use strict';

    angular
        .module('pbox')
        .factory('GeolocationModel', geolocationModelFactory);

    /** @ngInject */
    function geolocationModelFactory() {

        function GeolocationModel(obj) {
            this.latitude = obj && obj.latitude ? obj.latitude : null;
            this.longitude = obj && obj.longitude ? obj.longitude : null;
            this.message = obj && obj.message ? obj.message : '';
            this.address = obj && obj.address ? obj.address : '';
        }

        GeolocationModel.prototype.valid = function () {
            return (!!this.latitude && !!this.longitude);
        }

        GeolocationModel.prototype.parseGpsSensorValue = function (value) {
            var coordinates = value.split(",");
            this.latitude = coordinates[0];
            this.longitude = coordinates[1];
            return this;
        }
        
        return GeolocationModel;
    }
})();