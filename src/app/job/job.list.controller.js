(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobListController', jobListController);

    /** @ngInject */
    function jobListController($state, pboxLoader, jobService, $ionicPopup) {
        var vm = this;

        vm.jobs = [];
        vm.openJobDetails = openJobDetails;

        /////////////////////////////////////

        (function activate() {
            loadJobs();
            console.dir(vm);
        }());

        /////////////////////////////////////

        function loadJobs() {
            pboxLoader.loaderOn();
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
    }
})();