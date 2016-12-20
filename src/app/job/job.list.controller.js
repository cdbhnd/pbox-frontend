(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobListController', jobListController);

    /** @ngInject */
    function jobListController(jobService) {

        var vm = this;

        vm.jobs = [];

        /////////////////////////////////////

        (function activate() {
            loadJobs();
        }());

        /////////////////////////////////////

        function loadJobs() {
            return jobService.getAll()
                .then(function(response) {
                    console.log(response);
                    vm.jobs = response;
                })
        }
    }
})();