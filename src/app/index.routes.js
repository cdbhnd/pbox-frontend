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
                    controllerAs: 'vm',
                    data: {
                        disableBack: true
                    }
                })
                .state('job-list', {
                    url: '/jobs',
                    templateUrl: 'app/job/job.list.html',
                    controller: 'jobListController',
                    controllerAs: 'vm'
                })

            $urlRouterProvider.otherwise('/');
        }]);
})();