(function() {
    'use strict';

    angular
        .module('pbox.geolocation')
        .service('geolocationService', geolocationService);

    /** @ngInject */
    function geolocationService($q, GeolocationModel, $cordovaGeolocation, config) {
        var service = this;

        service.init = init;
        service.currentLocation = currentLocation;

        var _currentLocation;

        //////////////////////////////

        function init() {
            // if (config.randomCoords) {
            //     setFallbackCoordinates();
            //     return false;
            // }

            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    _currentLocation = new GeolocationModel({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    console.log('Location fetch: ');
                    console.log(_currentLocation);
                }, function(err) {
                    setFallbackCoordinates();
                });

            var watchOptions = {
                timeout: 3000,
                enableHighAccuracy: false // may cause errors if true
            };
            $cordovaGeolocation.watchPosition(watchOptions)
                .then(null,
                    function(err) {
                        if (!_currentLocation) {
                            setFallbackCoordinates();
                        }
                    },
                    function(position) {
                        _currentLocation = new GeolocationModel({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                        console.log('Location watch: ');
                        console.log(_currentLocation);
                    }
                );
        }

        function currentLocation() {
            return $q.when(function() {
                while (!_currentLocation) {}
                return _currentLocation;
            }());
        }

        function setFallbackCoordinates() {
            var randomCoords = randomGeo({
                latitude: 44.802433,
                longitude: 20.466403
            }, 10000);
            _currentLocation = new GeolocationModel({
                latitude: parseFloat(randomCoords.latitude),
                longitude: parseFloat(randomCoords.longitude)
            });
        }

        function randomGeo(center, radius) {
            var y0 = center.latitude;
            var x0 = center.longitude;
            var rd = radius / 111300; //about 111300 meters in one degree

            var u = Math.random();
            var v = Math.random();

            var w = rd * Math.sqrt(u);
            var t = 2 * Math.PI * v;
            var x = w * Math.cos(t);
            var y = w * Math.sin(t);

            //Adjust the x-coordinate for the shrinking of the east-west distances
            var xp = x / Math.cos(y0);

            var newlat = y + y0;
            var newlon = x + x0;
            var newlon2 = xp + x0;

            return {
                latitude: newlat.toFixed(8),
                longitude: newlon.toFixed(8)
            };
        }
    }
})();