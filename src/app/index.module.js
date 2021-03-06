(function() {
    'use strict';

    // Ionic PBOX App

    // angular.module is a global place for creating, registering and retrieving Angular modules
    // 'pbox' is the name of this angular module example (also set in a <body> attribute in index.html)
    // the 2nd parameter is an array of 'requires'
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
            'pbox.temperature'
        ])
        .run(function($rootScope, $state, $ionicPlatform, geolocationService, authService) {
            $ionicPlatform.ready(function() {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
                geolocationService.init();
                authService.init();
                $rootScope.current_state = $state.current;
                $rootScope.$on('$stateChangeSuccess', 
                    function(event, toState, toParams, fromState, fromParams){
                        $rootScope.current_state = toState;
                    });
            });
        });
})();