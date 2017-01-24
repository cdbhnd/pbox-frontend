(function () {
    'use strict';

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
            this.gps_sensor = obj && obj.sensors ? findSensor(obj.sensors, 'GPS') : null;
            this.temp_sensor = obj && obj.sensors ? findSensor(obj.sensors, 'TEMPERATURE') : null;
            this.acc_sensor = obj && obj.sensors ? findSensor(obj.sensors, 'ACCELEROMETER') : null;
            
            this._listen_active = false;
            this._sensors = obj && obj.sensors ? obj.sensors : [];
        }

        BoxModel.prototype.activate = function () {
            if (!this._listen_active) {
                iotService.listen(this);
                this._listen_active = true;
            }
        }

        BoxModel.prototype.deactivate = function () {
            if (this._listen_active) {
                iotService.stopListen(this.id);
                this._listen_active = false;
            }
        }

        BoxModel.prototype.setSensorValue = function (sensorId, value) {
            if (!!this.gps_sensor && this.gps_sensor.assetId == sensorId) {
                console.log('GPS sensor updated');
                console.log(value);
                var geolocationModel = new GeolocationModel();
                this.gps_sensor.value = geolocationModel.parseGpsSensorValue(value);
            }
            if (!!this.temp_sensor && this.temp_sensor.assetId == sensorId) {
                console.log('Temp sensor updated');
                console.log(value);
                var tempHumi = value.split(",");
                this.temp_sensor.value = {
                    temperature: tempHumi[0],
                    humidity: tempHumi[1]
                }
            }
            if (!!this.acc_sensor && this.acc_sensor.assetId == sensorId) {
                console.log('Acc sensor updated');
                console.log(value);
                var accelerometerValues = value.split(",");
                this.acc_sensor.value = {
                    ax: accelerometerValues[0],
                    ay: accelerometerValues[1],
                    az: accelerometerValues[2]
                };
            }
        }

        return BoxModel;

        function findSensor(sensors, type) {
            // find and return sensor by type;
            for (var i = 0; i < sensors.length; i++) {
                if (sensors[i].type == type) {
                    return sensors[i];
                }
            }
        }
    }
})();