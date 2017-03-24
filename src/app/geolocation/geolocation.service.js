(function (angular) {
    angular
        .module('pbox.geolocation')
        .service('geolocationService', geolocationService);

    /** @ngInject */
    function geolocationService($q, GeolocationModel, $cordovaGeolocation) {
        var service = this;

        //variables and properties
        var currentLocationObj;

        //public methods
        service.init = init;
        service.currentLocation = currentLocation;

        //////////////////////////////

        function init() {
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    currentLocationObj = new GeolocationModel({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                }, function () {
                    setFallbackCoordinates();
                });

            var watchOptions = {
                timeout: 3000,
                enableHighAccuracy: false // may cause errors if true
            };
            $cordovaGeolocation.watchPosition(watchOptions)
                .then(null,
                    function () {
                        if (!currentLocationObj) {
                            setFallbackCoordinates();
                        }
                    },
                    function (position) {
                        currentLocationObj = new GeolocationModel({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                    }
                );
        }

        function currentLocation() {
            return $q.when(function () {
                while (!currentLocationObj) {}
                return currentLocationObj;
            }());
        }

        function setFallbackCoordinates() {
            var randomCoords = randomGeo({
                latitude: 44.802433,
                longitude: 20.466403
            }, 10000);
            currentLocationObj = new GeolocationModel({
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

            var newlat = y + y0;
            var newlon = x + x0;

            return {
                latitude: newlat.toFixed(8),
                longitude: newlon.toFixed(8)
            };
        }
    }
})(window.angular);
