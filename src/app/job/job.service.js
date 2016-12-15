(function() {
    'use strict';

    angular
        .module('pbox.job')
        .service('jobService', jobService);

    /** @ngInject */
    function jobService($q, pboxApi, config, JobModel) {
        var service = this;

        service.create = createJob;

        //////////////////////////////

        function createJob(job) {
            /*return pboxApi.http({
            	method: confg.httpMethods.POST,
            	url: config.pboxAPI.JOBS,
            	data: job
            })
            .then(function(data) {
            	return new JobModel(data);
            });*/
            return $q.when(function() {
                return job;
            }());
        }
    }
})();
