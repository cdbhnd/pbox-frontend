(function() {
    'use strict';

    angular
        .module('pbox')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) { 

        	$stateProvider
                .state('job-create', {
                    url: '/',
                    templateUrl: 'app/job/job.create.html',
                    controller: 'jobCreateController',
                    controllerAs: 'vm'
                })

            $urlRouterProvider.otherwise('/');
        }]);
})();
