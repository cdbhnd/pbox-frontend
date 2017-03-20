(function (angular) {
    angular
        .module('pbox.job')
        .service('jobService', jobService);

    /**@ngInject */
    function jobService($q, pboxApi, config, JobModel, BoxModel) {
        var service = this;

        //variables and properties
        var jobs = [];

        //public methods
        service.createJob = createJob;
        service.getAllJobs = getAllJobs;
        service.getJob = getJob;
        service.getBox = getBox;
        service.getSensor = getSensor;

        //////////////////////////////

        function createJob(job) {
            return pboxApi.http({
                method: config.httpMethods.POST,
                url: config.pboxAPI.JOBS,
                data: job
            })
                .then(function (response) {
                    return new JobModel(response);
                });
        }

        function getAllJobs() {
            return pboxApi.http({
                method: config.httpMethods.GET,
                url: config.pboxAPI.JOBS
            })
                .then(function (response) {
                    if (response.length) {
                        for (var i = 0; i < response.length; i++) {
                            jobs[i] = new JobModel(response[i]);
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
                .then(function (response) {
                    return new JobModel(response);
                });
        }

        function getBox(boxId) {
            return pboxApi.http({
                method: config.httpMethods.GET,
                url: config.pboxAPI.BOXES + '/' + boxId
            })
                .then(function (response) {
                    return new BoxModel(response);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        function getSensor(sensorId) {
            return pboxApi.http({
                method: config.httpMethods.GET,
                url: config.pboxAPI.BOXES + '/' + sensorId + '/sensors'
            })
                .then(function (response) {
                    return response;
                });
        }
    }
})(window.angular);
