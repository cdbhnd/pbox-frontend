(function (angular) {
    angular
        .module('pbox.loader')
        .service('pboxLoader', pboxLoader);

    function pboxLoader($ionicLoading) {
        var service = this;

        //public methods
        service.loaderOn = loaderOn;
        service.loaderOff = loaderOff;

        //////////////////////////////////

        function loaderOn() {
            return $ionicLoading.show({
                templateUrl: 'app/loader/loader.html'
            });
        }

        function loaderOff() {
            return $ionicLoading.hide();
        }
    }
})(window.angular);
