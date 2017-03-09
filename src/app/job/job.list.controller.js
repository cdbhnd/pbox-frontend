(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobListController', jobListController);

    /** @ngInject */
    function jobListController($interval, $q, $scope, $state, pboxLoader, jobService, $ionicPopup) {
        var vm = this;
        var pollingPromise;

        vm.jobs = [];
        vm.openJobDetails = openJobDetails;
        vm.refreshList = refreshList;

        /////////////////////////////////////

        (function activate() {
            loadingOn()
                .then(loadJobs)
                .then(pollJobs)
                .then(cancelPollingPromiseOnScopeDestroy)
                .finally(loadingOff);
        }());

        /////////////////////////////////////

        function loadingOn() {
            return $q.when(function() {
                pboxLoader.loaderOn()
            }());
        }

        function loadingOff() {
            return $q.when(function() {
                pboxLoader.loaderOff()
            }());
        }

        function loadJobs() {
            return jobService.getAll()
                .then(function(response) {
                    vm.jobs = response;
                    if (response.length == 0) {
                        $ionicPopup.alert({
                            title: 'You do not have any Jobs at the moment !',
                            template: '',
                            buttons: [{
                                text: 'OK',
                                type: 'button-energized'
                            }]
                        });
                    }
                })
                .finally(function() {
                    pboxLoader.loaderOff();
                });
        }

        function openJobDetails(job) {
            if (job.status == 'IN_PROGRESS') {
                $state.go('job-details', { jobId: job.id });
            }
        }

        function refreshList() {
            loadJobs()
                .then(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function pollJobs() {
            return $q.when(function() {
                pollingPromise = $interval(function() {
                    return loadJobs();
                }, 15000);
                return true;
            }());
        }

        function cancelPollingPromiseOnScopeDestroy() {
            return $q.when(function() {
                $scope.$on('$destroy', function() {
                    if (!!pollingPromise) {
                        $interval.cancel(pollingPromise);
                    }
                });
                return true;
            }());
        }
    }
})();