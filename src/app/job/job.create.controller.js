(function() {
    'use strict';

    angular
        .module('pbox.job')
        .controller('jobCreateController', jobCreateController);

    /** @ngInject */
    function jobCreateController($q, jobService, geolocationService) {
    	
    	var vm = this;

    	vm.selectedSize = 'S';

    	vm.selectSize = selectSize;
    	vm.orderJob = orderJob;

    	/////////////////////////////////////

    	function selectSize(size) {
    		vm.selectSize = size;
    	}

    	function orderJob() {
    		return validateJob
    			.then(getCurrentUsersLocation)
    			.then(doCreateJob)
    			.then(createSuccess)
    			.catch(createError);
    	}

    	function validateJob() {
    		return $q.when(function() {
    			if (!vm.selectedSize) {
    				return $q.reject('Size not selected');
    			}
    			return true;
    		}());
    	}

    	function getCurrentUsersLocation() {
    		return geolocationService.currentLocation()
    			.catch(function(e) {
    				return $q.reject('Location could not be determined');
    			});
    	}

    	function doCreateJob(location) {
    		return jobService.create({
    			pickup: location,
    			size: vm.selectedSize
    		});
    	}

    	function createSuccess() {
    		return $q.when(function() {
    			alert('Success');
    		}());
    	}

    	function createError() {
    		return $q.when(function() {
    			alert('Error');
    		}());
    	}
    }
})();
