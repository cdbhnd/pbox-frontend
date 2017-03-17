(function (angular) {
    angular
        .module('pbox')
        .factory('SensorModel', SensorModelFactory);

    /**@ngInject */
    function SensorModelFactory() {
        function SensorModel(obj) {
            this.name = obj && obj.name ? obj.name : null;
            this.code = obj && obj.code ? obj.code : null;
            this.status = obj && obj.status ? obj.status : null;
            this.value = obj && obj.value ? obj.value : null;
            this.assetId = obj && obj.assetId ? obj.assetId : null;
            this.assetName = obj && obj.assetName ? obj.assetName : null;
            this.topic = obj && obj.topic ? obj.topic : null;
            this.type = obj && obj.type ? obj.type : null;
        }

        return SensorModel;
    }
})(window.angular);
