angular
    .module('Platease')
    .controller('sensorsController', ['$scope','$timeout', 'SensorData', function($scope, $timeout, SensorData){

        $scope.sensor_data = {
            cloudsalud: {
                tag: 'realtime',
                success: true,
                error: false,
                sensors: [
                    {
                        id: 0,
                        name: 'Temperatura',
                        value: 37.2,
                        type_sensor: 1,
                        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
                        series: 'Temperatura corporal',
                        data: [
                            [35.6, 37, 37.5, 38, 38.3, 0, 0],
                        ]
                    },
                    {
                        id: 1,
                        name: 'Oxígeno',
                        value: 87,
                        type_sensor: 3,
                        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
                        series: 'Concentracion de oxígeno',
                        data: [
                            [40, 60, 80, 70, 60, 0, 0],
                        ]
                    },
                    {
                        id: 2,
                        name: 'Ritmo cardíaco',
                        value: 93,
                        type_sensor: 2,
                        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
                        series: 'Ritmo cardíaco',
                        data: [
                            [98, 90, 130, 146, 30, 0, 0],
                        ]
                    },

                ]
            }
        };

        //SensorData.then(function(data){
        //
        //    //var sensors = data.laria.sensors;
        //    //
        //    //for(var i in sensors){
        //    //   console.log(sensors[i]);
        //    //}
        //
        //}, function(){
        //    alert('Ha ocurrido un error al obtener datos de los sensores');
        //});
    }]);

