angular
    .module('Platease')
    .controller('unaproveddoctorsController', ['$scope', 'Doctor', '$q', 'Patients', '$http', '$modal', function ($scope, Doctor, $q, Patients, $http, $modal) {

        toastr.options.closeButton = true;
        $scope.doctorShow = false;


        Doctor.getAllDoctorsUnapproved().then(function(doctors){
            $scope.doctors = doctors;
        }, function(){
            toastr.error('Error al traer lista de Doctor');
        });

        $scope.deleteDoctor = function(doctor_id){
            Doctor.deleteDoctor(doctor_id).then(function(){
                Doctor.getAllDoctorsUnapproved().then(function(doctors){
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
                templateUrl: '/public/templates/modal/deleteunapproveddoctor.html',
                controller: 'unaproveddoctorsController',
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
                toastr.error('Error al traer Doctor');
            });



        }

        $scope.certifyDoctor = function(doctor_id){
            Doctor.certifyDoctor(doctor_id).then(function(){
                $scope.doctorShow = false;
                toastr.success('Operación Realizada Satisfactoriamente');
                Doctor.getAllDoctorsUnapproved().then(function(doctors){
                    $scope.doctors = doctors;
                }, function(){
                    toastr.error('Error al traer lista de Doctor');
                });
            }, function(){
                toastr.error('Error al certificar el Doctor');
            });
        }


    }]);