(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobDetailsController', jobDetailsController);

    /** @ngInject */
    function jobDetailsController($q, $state, pboxLoader, jobService, geolocationService, mapConfig) {

        var vm = this;

        vm.job = null;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.markerColors = ['#33CBCC', '#3F5877'];

        (function activate() {
            pboxLoader.loaderOn()
                .then(verifyJobId)
                .then(loadMapOptions)
                .then(getCurrentLocation)
                .then(loadJob)
                .then(verifyJobStatus)
                .then(loadMapMarkers)
                .catch(function(e) {
                    console.log(e);
                    $state.go('job-list');
                })
                .finally(pboxLoader.loaderOff)
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
                vm.mapMarkers.push(vm.job.pickup);
                if (!!vm.job.destination && vm.job.destination.valid()) {
                    vm.mapMarkers.push(vm.job.destination);
                }
            }());
        }

        function loadMapOptions() {
            return $q.when(function() {
                vm.mapOptions.disableDefaultUI = true;
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
    }
}());
