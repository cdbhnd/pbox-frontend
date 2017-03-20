(function (angular, cordova) {
    angular.module('pbox', ['angularMoment',
        'ionic',
        'ngCordova',
        'ngStorage',
        'pbox.job',
        'pbox.geolocation',
        'pbox.api',
        'pbox.auth',
        'pbox.loader',
        'pbox.nav',
        'pbox.map',
        'pbox.iot',
        'pbox.temperature',
        'pbox.alert'
    ])
        .run(function ($rootScope, $state, $ionicPlatform, geolocationService, authService) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    window.StatusBar.styleDefault();
                }
                geolocationService.init();
                authService.init();
                $rootScope.currentState = $state.current;
                $rootScope.$on('$stateChangeSuccess',
                    function (toState) {
                        $rootScope.currentState = toState;
                    });
            });
        });
})(window.angular, window.cordova);
