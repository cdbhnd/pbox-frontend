(function (angular) {
    angular
        .module('pbox.job')
        .controller('jobListController', jobListController);

    /**@ngInject */
    function jobListController($interval, $q, $scope, $state, pboxLoader, jobService, pboxAlert) {
        var vm = this;

        //variables and properties
        var pollingPromise;
        vm.jobs = [];

        //public methods
        vm.openJobDetails = openJobDetails;
        vm.refreshList = refreshList;

        /////////////////////////////////////
        /**Activate */
        (function () {
            loadingOn()
                .then(loadJobs)
                .then(loadingOff)
                .then(pollJobs)
                .then(cancelPollingPromiseOnScopeDestroy);
        }());

        /////////////////////////////////////

        function openJobDetails(job) {
            if (job.status === 'IN_PROGRESS') {
                $state.go('job-details', { jobId: job.id });
            }
        }

        function refreshList() {
            loadJobs()
                .then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function loadingOn() {
            return pboxLoader.loaderOn();
        }

        function loadJobs() {
            return jobService.getAllJobs()
                .then(function (response) {
                    vm.jobs = response;
                    if (response.length === 0) {
                        loadingOff()
                            .then(function () {
                                return pboxAlert.riseAlert('You do not have any jobs at the moment');
                            });
                    }
                    return true;
                });
        }

        function loadingOff() {
            return pboxLoader.loaderOff();
        }

        function pollJobs() {
            return $q.when(function () {
                pollingPromise = $interval(function () {
                    return loadJobs();
                }, 15000);
                return true;
            }());
        }

        function cancelPollingPromiseOnScopeDestroy() {
            return $q.when(function () {
                $scope.$on('$destroy', function () {
                    if (!!pollingPromise) {
                        $interval.cancel(pollingPromise);
                    }
                });
                return true;
            }());
        }
    }
})(window.angular);
