(function () {
	'use strict';

	angular
		.module('pbox.api')
		.service('pboxApi', pboxApi);

	/** @ngInject */
	function pboxApi($http, config) {
		var service = this;

		service.http = http;

		//////////////////////////////////

		function http(params) {

			params.url = config.pboxAPI.HOST + params.url;

			return $http(params)
				.return(function(response) {
					return response.data;
				});
		}
	}
})();