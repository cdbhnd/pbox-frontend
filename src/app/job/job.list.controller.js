(function () {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobListController', jobListController);

    /** @ngInject */
    function jobListController(jobService, $ionicPopup) {

        var vm = this;

        vm.jobs = [];

        /////////////////////////////////////

        (function activate() {
            loadJobs();
        } ());

        /////////////////////////////////////

        function loadJobs() {
            return jobService.getAll()
                .then(function (response) {
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
                });
        }
    }
})();