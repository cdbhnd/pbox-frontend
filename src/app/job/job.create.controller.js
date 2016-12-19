(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobCreateController', jobCreateController);

    /** @ngInject */
    function jobCreateController($q, $ionicPopup, $state, jobService, geolocationService) {

        var vm = this;

        vm.selectedSize = 'S';

        vm.selectSize = selectSize;
        vm.orderJob = orderJob;

        /////////////////////////////////////

        function selectSize(size) {
            vm.selectedSize = size;
        }

        function orderJob() {
            return validateJob()
                .then(getCurrentUsersLocation)
                .then(doCreateJob)
                .then(createSuccess)
                .catch(createError);
        }

        function validateJob() {
            return $q.when(function() {
                if (!vm.selectedSize) {
                    return $q.reject('Size not selected');
                }
                return true;
            }());
        }

        function getCurrentUsersLocation() {
            return geolocationService.currentLocation()
                .catch(function(e) {
                    return $q.reject('Location could not be determined');
                });
        }

        function doCreateJob(location) {
            return jobService.create({
                pickup: location,
                size: vm.selectedSize
            });
        }

        function createSuccess() {
            return $q.when(function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'JOB CREATED!',
                    template: '',
                    buttons: [{
                        text: 'OK',
                        type: 'button-energized'
                    }]
                });

                alertPopup.then(function(res) {
                    $state.go('job-list');
                });
            }());
        }

        function createError() {
            return $q.when(function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'ERROR!',
                    template: 'Job create failed'
                });

                alertPopup.then(function(res) {
                    // ???
                });
            }());
        }
    }
})();