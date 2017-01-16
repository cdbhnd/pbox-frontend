(function() {
    'use strict';

    angular
        .module('pbox.job')
        .service('jobService', jobService);

    /** @ngInject */
    function jobService($q, pboxApi, config, JobModel) {
        var service = this;

        service.create = createJob;
        service.getAll = getAllJobs;
        service.getJob = getJob;

        //////////////////////////////

        function createJob(job) {
            return pboxApi.http({
                    method: config.httpMethods.POST,
                    url: config.pboxAPI.JOBS,
                    data: job
                })
                .then(function(data) {
                    return new JobModel(data);
                });
        }

        function getAllJobs() {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.JOBS
                })
                .then(function(data) {
                    var jobs = [];

                    if (data.length) {
                        for (var i = 0; i < data.length; i++) {
                            jobs[i] = new JobModel(data[i]);
                        }
                    }

                    return jobs;
                });
        }

        function getJob(jobId) {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.JOBS + '/' + jobId
                })
                .then(function(response) {
                    return new JobModel(response);
                });
        }
    }
})();
