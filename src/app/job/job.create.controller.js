(function (angular) {
  angular
    .module('pbox.job')
    .controller('jobCreateController', jobCreateController);

  /**@ngInject */
  function jobCreateController(pboxLoader, $scope, $q, $ionicPopup,
    $state, jobService, geolocationService, pboxAlert) {
    var vm = this;

    //variables and properties
    vm.selectedSize = 'S';

    //public methods
    vm.selectSize = selectSize;
    vm.orderJob = orderJob;

    //////////////////////////////////

    function orderJob() {
      loadingOn()
        .then(validateJob)
        .then(getCurrentUsersLocation)
        .then(doCreateJob)
        .then(showSuccess)
        .catch(showError)
        .finally(loadingOff);
    }

    function loadingOn() {
      return $q.when(function () {
        pboxLoader.loaderOn();
      }());
    }

    function validateJob() {
      if (!vm.selectedSize) {
        return $q.reject('Size not selected');
      }
      return true;
    }

    function getCurrentUsersLocation() {
      return geolocationService.currentLocation()
        .catch(function () {
          return $q.reject('Location could not be determined');
        });
    }

    function doCreateJob(location) {
      return jobService.create({
        pickup: location,
        size: vm.selectedSize
      });
    }

    function showSuccess() {
      return pboxAlert.riseAlert('JOB CREATED')
        .then(function () {
          $state.go('job-list');
        });
    }

    function showError() {
      return pboxAlert.riseAlert('ERROR!', 'Job creation failed');
    }

    function loadingOff() {
      return $q.when(function () {
        pboxLoader.loaderOff();
      }());
    }

    function selectSize(size) {
      vm.selectedSize = size;
    }
  }
})(window.angular);
