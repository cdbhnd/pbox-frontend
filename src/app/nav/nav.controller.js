(function() {
    'use strict';

    angular
        .module('pbox.nav')
        .controller('navController', navController);

    /** @ngInject */
    function navController($state) {

        var vm = this;

        vm.changeState = changeState;

        /////////////////////////////////////

        (function activate() {}());

        /////////////////////////////////////

        function changeState(state) {
            $state.go(state);
        }

    }
})();