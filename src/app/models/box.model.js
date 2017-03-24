(function (angular) {
    angular
        .module('pbox')
        .factory('BoxModel', boxModelFactory);

    /** @ngInject */
    function boxModelFactory(iotService, GeolocationModel) {
        function BoxModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.code = obj && obj.code ? obj.code : null;
            this.size = obj && obj.size ? obj.size : null;
            this.status = obj && obj.status ? obj.status : null;
            this.host = obj && obj.host ? obj.host : null;
            this.topic = obj && obj.topic ? obj.topic : null;
            this.groundId = obj && obj.groundId ? obj.groundId : null;
            this.clientId = obj && obj.clientId ? obj.clientId : null;
            this.clientKey = obj && obj.clientKey ? obj.clientKey : null;
            this.deviceId = obj && obj.deviceId ? obj.deviceId : null;
            this.deviceName = obj && obj.deviceName ? obj.deviceName : null;
            this.gpsSensor = obj && obj.sensors ? findSensor(obj.sensors, 'GPS') : null;
            this.tempSensor = obj && obj.sensors ? findSensor(obj.sensors, 'TEMPERATURE') : null;
            this.accSensor = obj && obj.sensors ? findSensor(obj.sensors, 'ACCELEROMETER') : null;

            this.listenActive = false;
            this.sensors = obj && obj.sensors ? obj.sensors : [];
        }

        BoxModel.prototype.activate = function () {
            if (!this.listenActive) {
                iotService.listen(this);
                this.listenActive = true;
            }
        }

        BoxModel.prototype.deactivate = function () {
            if (this.listenActive) {
                iotService.stopListen(this.id);
                this.listenActive = false;
            }
        }

        BoxModel.prototype.setSensorValue = function (sensorId, value) {
            if (!!this.gpsSensor && this.gpsSensor.assetId === sensorId) {
                console.log('GPS sensor updated');
                console.log(value);
                var geolocationModel = new GeolocationModel();
                this.gpsSensor.value = geolocationModel.parseGpsSensorValue(value);
            }
            if (!!this.tempSensor && this.tempSensor.assetId === sensorId) {
                console.log('Temp sensor updated');
                console.log(value);
                var tempHumi = value.split(',');
                this.tempSensor.value = {
                    temperature: tempHumi[0],
                    humidity: tempHumi[1]
                }
            }
            if (!!this.accSensor && this.accSensor.assetId === sensorId) {
                console.log('Acc sensor updated');
                console.log(value);
                var accelerometerValues = value.split(',');
                this.accSensor.value = {
                    ax: accelerometerValues[0],
                    ay: accelerometerValues[1],
                    az: accelerometerValues[2]
                };
            }
        }

        return BoxModel;

        function findSensor(sensors, type) {
            for (var i = 0; i < sensors.length; i++) {
                if (sensors[i].type === type) {
                    return sensors[i];
                }
            }
            return true;
        }
    }
})(window.angular);
