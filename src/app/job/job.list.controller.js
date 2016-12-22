(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobListController', jobListController);

    /** @ngInject */
    function jobListController(pboxLoader, jobService) {

        var vm = this;

        vm.jobs = [];

        /////////////////////////////////////

        (function activate() {
            loadJobs();
        }());

        /////////////////////////////////////

        function loadJobs() {
            pboxLoader.loaderOn();
            return jobService.getAll()
                .then(function(response) {
                    vm.jobs = response;
                })
                .finally(function(){
                    pboxLoader.loaderOff();
                });
        }
    }
})();