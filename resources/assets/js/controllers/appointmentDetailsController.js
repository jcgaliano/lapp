angular
    .module('Platease')
    .controller('appointmentDetailsController', ['$scope', 'AppoimentDetails', function($scope, AppoimentDetails){
        $scope.seemorescreen = false;
        AppoimentDetails.getAllIndicationsByPatient().then(function(data){

            $scope.data = data;

        }, function(){
            alert('Ha ocurrido un error al obtener las citas médicas');
        });

        $scope.seemore = function(appointment_id){
            $scope.seemorescreen = true;
            AppoimentDetails.getAIndicationsByPatient(appointment_id).then(function(appointment_detatail){
                $scope.appointment_detatail = appointment_detatail;
             }, function(){

             });
        };

        $scope.cancelseemore = function(){
            $scope.seemorescreen = false;
        };

    }]);