(function() {
    'use strict';

    angular
        .module('pbox.auth')
        .service('authService', authService);

    /** @ngInject */
    function authService($q, pboxApi, config, $localStorage, UserModel) {

        var service = this;

        service.init = init;
        service.register = register;
        service.login = login;
        service.currentUser = currentUser;

        //////////////////////////////////

        function init() {
            registerUserIfNeeded();
        }

        function register(user) {
            return pboxApi.http({
                    method: config.httpMethods.POST,
                    url: config.pboxAPI.USERS,
                    data: user
                })
                .then(function(data) {
                    var userModel = new UserModel(data);
                    $localStorage.current_user = userModel;
                    return userModel;
                });
        }

        function login(username, password) {
            return pboxApi.http({
                    method: config.httpMethods.POST,
                    url: config.pboxAPI.TOKEN,
                    data: {
                        username: username,
                        password: password
                    }
                })
                .then(function(data) {
                    var userModel = new UserModel(data);
                    $localStorage.current_user = userModel;
                    return userModel;
                });
        }

        function currentUser() {
            return $q.when(function() {
                if ($localStorage.current_user) {
                    return $localStorage.current_user;
                }
                return null;
            }());
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function registerUserIfNeeded() {
            return $q.when(function() {
                if (!$localStorage.credentials) {
                    var userData = new UserModel();
                    userData.username = guid();
                    userData.password = guid();
                    userData.type = 1;
                    return register(userData)
                        .then(function(user) {
                            $localStorage.credentials = {
                                username: userData.username,
                                password: userData.password,
                                type: userData.type
                            };
                            return true;
                        })
                        .catch(function(errr) {
                            alert('Server unavailable at the moment, please try again later.');
                            console.log(errr);
                            return $q.reject('server unavailable');
                        });
                }
                return true;
            }());
        }

        function loginUserIfNeeded() {
            return $q.when(function() {}());
        }
    }
})();
