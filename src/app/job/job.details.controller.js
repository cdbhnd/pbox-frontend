(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobDetailsController', jobDetailsController);

    /** @ngInject */
    function jobDetailsController($scope, $window, $q, $state, pboxLoader, jobService, geolocationService, mapConfig) {

        var vm = this;

        vm.job = null;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.markerColors = ['#33CBCC', '#3F5877', '#F44242'];
        vm.box = null;
        vm.mapOptions.zoom = 15;
        (function activate() {
            pboxLoader.loaderOn()
                .then(verifyJobId)
                .then(loadMapOptions)
                .then(getCurrentLocation)
                .then(loadJob)
                .then(verifyJobStatus)
                .then(loadMapMarkers)
                .then(loadBox)
                .catch(function(e) {
                    console.log(e);
                    $state.go('job-list');
                })
                .finally(pboxLoader.loaderOff);
        }());

        function verifyJobId() {
            return $q.when(function() {
                if (!$state.params.jobId) {
                    return $q.reject('Job Id is missing');
                }
                return true;
            }());
        }

        function loadJob() {
            return jobService.getJob($state.params.jobId)
                .then(function(response) {
                    vm.job = response;
                });
        }

        function verifyJobStatus() {
            return $q.when(function() {
                if (!vm.job || vm.job.status != 'IN_PROGRESS') {
                    return $q.reject('Only jobs with status IN_PROGRESS can be shown');
                }
                return true;
            }());
        }

        function loadMapMarkers() {
            return $q.when(function() {
                setMarkerProperties(vm.job.pickup, 'images/pickup-pin.png');
                if (!!vm.job.destination && vm.job.destination.valid()) {
                    setMarkerProperties(vm.job.destination, 'images/destination-pin.png');
                }
            }());
        }

        function setMarkerProperties(geolocationObj, iconPath) {
            vm.mapMarkers.push({
                latitude: geolocationObj.latitude,
                longitude: geolocationObj.longitude,
                icon: iconPath
            });
        }

        function loadMapOptions() {
            return $q.when(function() {
                vm.mapOptions.streetViewControl = false;
                return true;
            }());
        }

        function getCurrentLocation() {
            return geolocationService.currentLocation()
                .then(function(coords) {
                    vm.mapOptions.mapCenter = coords;
                    return true;
                });
        }

        function loadBox() {
            return jobService.getBox(vm.job.box)
                .then(function(response) {
                    vm.box = response;
                    vm.box.activate();
                    $scope.$on('$destroy', function() {
                        vm.box.deactivate();
                    });
                });
        }
    }
}());