(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobListController', jobListController);

    /** @ngInject */
    function jobListController($localStorage, jobService) {

        var vm = this;

        var token = 'Bearer ' + $localStorage.current_user.token;

        vm.jobs = [];

        /////////////////////////////////////

        (function activate() {
            loadJobs();
        }());

        /////////////////////////////////////

        function loadJobs() {
            return jobService.getAll(token)
                .then(function(response) {
                    console.log(response);
                    vm.jobs = response;
                })
        }
    }
})();