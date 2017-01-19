(function () {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobDetailsController', jobDetailsController);

    /** @ngInject */
    function jobDetailsController($window, $q, $state, pboxLoader, jobService, geolocationService, mapConfig) {

        var vm = this;

        vm.job = null;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.markerColors = ['#33CBCC', '#3F5877'];
        vm.box = null;
        (function activate() {
            pboxLoader.loaderOn()
                .then(verifyJobId)
                .then(loadMapOptions)
                .then(getCurrentLocation)
                .then(loadJob)
                .then(verifyJobStatus)
                .then(loadMapMarkers)
                .then(loadBox)
                .then(startFeedReading)
                .catch(function (e) {
                    console.log(e);
                    $state.go('job-list');
                })
                .finally(pboxLoader.loaderOff)
        } ());

        function verifyJobId() {
            return $q.when(function () {
                if (!$state.params.jobId) {
                    return $q.reject('Job Id is missing');
                }
                return true;
            } ());
        }

        function loadJob() {
            return jobService.getJob($state.params.jobId)
                .then(function (response) {
                    vm.job = response;
                });
        }

        function verifyJobStatus() {
            return $q.when(function () {
                if (!vm.job || vm.job.status != 'IN_PROGRESS') {
                    return $q.reject('Only jobs with status IN_PROGRESS can be shown');
                }
                return true;
            } ());
        }

        function loadMapMarkers() {
            return $q.when(function () {
                vm.mapMarkers.push(vm.job.pickup);
                if (!!vm.job.destination && vm.job.destination.valid()) {
                    vm.mapMarkers.push(vm.job.destination);
                }
            } ());
        }

        function loadMapOptions() {
            return $q.when(function () {
                vm.mapOptions.disableDefaultUI = true;
                vm.mapOptions.streetViewControl = false;
                return true;
            } ());
        }

        function getCurrentLocation() {
            return geolocationService.currentLocation()
                .then(function (coords) {
                    vm.mapOptions.mapCenter = coords;
                    return true;
                });
        }

        function loadBox() {
            return jobService.getBox(vm.job.box)
                .then(function (response) {
                    vm.box = response;
                });
        }

        function startFeedReading() {
            console.log('----------startFeed----------');
            var host = "https://api.allthingstalk.io:15671/stomp";

            var ws = new $window.SockJS(host);
            var s = $window.Stomp.over(ws);

            s.heartbeat.outgoing = 2000;
            s.heartbeat.incoming = 0;

            s.connect(vm.box.clientId, vm.box.clientKey,
                function (success) {
                    s.subscribe(vm.box.topic, function (data) {
                        console.log(data);
                    });
                },
                function (error) { },
                vm.box.clientId);
        }
    }
} ());
