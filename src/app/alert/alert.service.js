(function (angular) {
    angular
        .module('pbox.alert')
        .service('pboxAlert', pboxAlert);

    /**@ngInject */
    function pboxAlert($ionicPopup) {
        var service = this;

        //public methods
        service.riseAlert = riseAlert;

        //////////////////////////////////

        function riseAlert(title, template) {
            return $ionicPopup.alert({
                title: title,
                template: template || '',
                buttons: [{
                    text: 'OK',
                    type: 'button-energized'
                }]
            });
        }
    }
}(window.angular));
