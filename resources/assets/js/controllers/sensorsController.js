angular
    .module('Platease')
    .controller('sensorsController', ['$scope','$timeout', 'SensorData', 'amMoment', 'dialog', function($scope, $timeout, SensorData, amMoment, dialog){

        console.log(amMoment);

        $scope.loadingChart = false;

        $scope.loadingChartMessage = 'Cargando gráfica...';

        $scope.selectSensor = function(sensorName, displayName){

            $scope.sensorName = sensorName;

            $scope.displayName = displayName;

            // $scope.values = [];
            //
            // $scope.labels = [];

        };

        $scope.showChart = function(){

            if (!$scope.sensorName){
                dialog.alert('Aviso', 'Debe seleccionar el parámetro que desea monitorear');
                return;
            }

            var start_date = $scope.start_date ? moment($scope.start_date) : null;

            var end_date = $scope.end_date ? moment($scope.end_date) : null;


            if (start_date && end_date){
                //check date precedence
                if (!end_date.isAfter(start_date) && !end_date.isSame(start_date, 'day')){
                    dialog.alert('Error', 'La fecha final no puede ser anterior a la fecha inicial');
                    return;
                }
            }

            $scope.loadingChart = true;

            $scope.series = $scope.displayName;

            SensorData.getSensorData($scope.sensorName, $scope.start_date, $scope.end_date)
                .then(function(data){

                    if (data.values.length == 0){
                        $scope.values = [];
                        $scope.labels  = [];

                        dialog.alert('Aviso', 'Lo sentimos no hay datos registrados para el período seleccionado');

                        $scope.loadingChart = false;

                        return;
                    }

                    $scope.labels = data.labels;

                    var values = [];

                    values.push(data.values);

                    $scope.values = values;

                    $scope.loadingChart = false;

                }, function(){
                    $scope.loadingChartMessage = 'Ha ocurrido un error al cargar la gráfica';
                });

        };

    }]);

