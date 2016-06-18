angular
    .module('Platease')
    .controller('doctorsController', ['$scope', 'Doctor', '$q', 'Patients', '$http', '$modal', function ($scope, Doctor, $q, Patients, $http, $modal) {

        toastr.options.closeButton = true;
        $scope.updateShow = false;

        Doctor.getAllDoctors().then(function(doctors){
            $scope.doctors = doctors;
        }, function(){
            toastr.error('Error al Traer Lista de Doctores');
        });

        $scope.deleteDoctor = function(doctor_id){
            Doctor.deleteDoctor(doctor_id).then(function(){
                Doctor.getAllDoctors().then(function(doctors){
                    $scope.doctors = doctors;
                }, function(){
                    toastr.error('Error al Traer Lista de Doctores');
                });
                toastr.success('Operación Realizada Satisfactoriamente');
            }, function(){
                toastr.error('Error al Eliminar el Doctor');
            });
        };

        $scope.confirmdelete = function(doctor_id){

            Doctor.getADoctorByIdpassed(doctor_id).then(function(doctor){
             $scope.doctor = doctor;
            }, function(){
                toastr.error('Error al traer al Doctor');
            });
            $modal.open({
                animation: true,
                templateUrl: '/public/templates/modal/deletedoctor.html',
                controller: 'doctorsController',
                size: 'md',
                scope : $scope
            }).result.then(function () {
                    $scope.deleteDoctor(doctor_id);
                }, function () {
                    toastr.info('Cancelada Satisfactoriamente');
                });
        };

        $scope.seemore = function(doctor_id){

            $scope.doctorShow = true;

            Doctor.getADoctorByIdpassed(doctor_id).then(function(doctor){
                $scope.doctor = doctor;
            }, function(){
                toastr.error('Error al traer medico');
            });



        }

    }]);