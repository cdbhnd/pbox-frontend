(function() {
    'use strict';

    angular
        .module('pbox')
        .factory('JobModel', jobModelFactory);

    /** @ngInject */
    function jobModelFactory() {

        function JobModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.pickup = obj && obj.pickup ? obj.pickup : null;
            this.size = obj && obj.size ? obj.size : null;
            this.status = obj && obj.status ? obj.status : null;
            this.name = obj && obj.name ? obj.name : null;
            this.owner = obj && obj.owner ? obj.owner : null;
            this.createdAt = obj && obj.createdAt ? obj.createdAt : null;
        }
        return JobModel;
    }
})();
