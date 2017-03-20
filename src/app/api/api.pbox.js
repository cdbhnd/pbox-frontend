(function (angular) {
    angular
        .module('pbox.api')
        .service('pboxApi', pboxApi);

    /**@ngInject */
    function pboxApi($http, config, $localStorage) {
        var service = this;

        //public methods
        service.http = http;

        //////////////////////////////////

        function http(params) {
            params.url = config.pboxAPI.HOST + params.url;

            if (!!$localStorage.currentUser && !!$localStorage.currentUser.token) {
                if (!params.headers) {
                    params.headers = {};
                }
                params.headers.Authorization = 'Bearer ' + $localStorage.currentUser.token;
            }

            return $http(params)
                .then(function (response) {
                    return response.data;
                });
        }
    }
}(window.angular));
