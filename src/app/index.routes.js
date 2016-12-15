(function() {
    'use strict';

    angular
        .module('pbox')
        .config(['$stateProvider', function($stateProvider) { 

        	$stateProvider
                .state('job-create', {
                    url: '/',
                    templateUrl: 'app/job/job.create.html',
                    controller: 'jobCreateController',
                    controllerAs: 'vm'
                });
        }]);
})();
