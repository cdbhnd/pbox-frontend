(function (angular) {
    angular
        .module('pbox.auth')
        .service('authService', authService);

    /**@ngInject */
    function authService($q, pboxApi, config, $localStorage, UserModel) {
        var service = this;

        //variables and properties
        var userData = new UserModel();

        //public methods
        service.init = init;
        service.register = registerUser;
        service.login = loginUser;
        service.currentUser = currentUser;

        //////////////////////////////////

        function init() {
            registerUserIfNeeded()
                .then(loginUserIfNeeded);
        }

        function registerUser(user) {
            return pboxApi.http({
                method: config.httpMethods.POST,
                url: config.pboxAPI.USERS,
                data: user
            })
                .then(function (response) {
                    var userModel = new UserModel(response);
                    $localStorage.currentUser = userModel;
                    return userModel;
                });
        }

        function loginUser(username, password) {
            return pboxApi.http({
                method: config.httpMethods.POST,
                url: config.pboxAPI.TOKEN,
                data: {
                    username: username,
                    password: password
                }
            })
                .then(function (response) {
                    var userModel = new UserModel(response);
                    $localStorage.currentUser = userModel;
                    return userModel;
                });
        }

        function currentUser() {
            return $q.when(function () {
                if ($localStorage.currentUser) {
                    return $localStorage.currentUser;
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
            return $q.when(function () {
                if (!$localStorage.credentials) {
                    userData.username = guid();
                    userData.password = guid();
                    userData.type = 1;
                    return registerUser(userData)
                        .then(function () {
                            $localStorage.credentials = {
                                username: userData.username,
                                password: userData.password,
                                type: userData.type
                            };
                            return true;
                        })
                        .catch(function () {
                            return serverUnavailable($q);
                        });
                }
                return true;
            }());
        }

        function loginUserIfNeeded() {
            return $q.when(function () {
                if (!!$localStorage.currentUser && !!$localStorage.currentUser.token) {
                    return true;
                }
                if (!$localStorage.credentials) {
                    return serverUnavailable($q);
                }
                return loginUser($localStorage.credentials.username, $localStorage.credentials.password)
                    .catch(function () {
                        return serverUnavailable($q);
                    });
            }());
        }

        function serverUnavailable(q) {
            return q.reject('server unavailable');
        }
    }
})(window.angular);
