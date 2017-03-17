(function (angular) {
    angular
        .module('pbox.iot')
        .service('iotService', iotService);

    /**@ngInject */
    function iotService($rootScope, $window) {
        var service = this;

        //variables and properties
        var host = 'https://api.allthingstalk.io:15671/stomp';
        var listeners = {};

        //public methods
        service.listen = listenBox;
        service.stopListen = stopListenBox;
        service.stopListenAll = stopListenAllBoxes;

        //////////////////////////////////

        function listenBox(box) {
            if (!!listeners[box.id]) {
                return true;
            }
            var ws = new $window.SockJS(host);
            var s = $window.Stomp.over(ws);
            try {
                s.heartbeat.outgoing = 2000;
                s.heartbeat.incoming = 0;

                s.connect(box.clientId, box.clientKey, function () {
                    s.subscribe(box.topic, function (response) {
                        var data = JSON.parse(response.body);
                        box.setSensorValue(data.Id, data.Value);
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    });
                }, function () { }, box.clientId);

                listeners[box.id] = s;
                return true;
            } catch (e) {
                return false;
            }
        }

        function stopListenBox(boxId) {
            if (listeners[boxId]) {
                listeners[boxId].disconnect(function () {
                    delete listeners[boxId];
                });
            }
        }

        function stopListenAllBoxes() {
            for (var i in listeners) {
                if (listeners.hasOwnProperty(i)) {
                    stopListenBox(i);
                }
            }
        }
    }
})(window.angular);
