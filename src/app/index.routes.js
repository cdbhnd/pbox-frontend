(function (angular) {
    angular
        .module('pbox')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('job-create', {
                    url: '/',
                    templateUrl: 'app/job/job.create.html',
                    controller: 'jobCreateController',
                    controllerAs: 'vm',
                    title: 'PBox',
                    data: {
                        disableBack: true
                    }
                })
                .state('job-list', {
                    url: '/jobs',
                    templateUrl: 'app/job/job.list.html',
                    controller: 'jobListController',
                    title: 'My Jobs',
                    controllerAs: 'vm',
                    cache: false
                })
                .state('job-details', {
                    url: '/jobs/:jobId',
                    templateUrl: 'app/job/job.details.html',
                    controller: 'jobDetailsController',
                    title: 'Job Details',
                    controllerAs: 'vm',
                    cache: false
                });
            $urlRouterProvider.otherwise('/');
        }]);
})(window.angular);
