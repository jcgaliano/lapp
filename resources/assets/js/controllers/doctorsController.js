angular
    .module('Platease')
    .controller('DoctorsController', ['$scope', 'Doctor', 'Patients', 'doctors', '$modal', function ($scope, Doctor, Patients, doctors, $modal) {

        $scope.doctors = doctors;

        $scope.removeDoctor = function(doctor, index){

            $scope.doctor = doctor;

            $modal.open({
                templateUrl: '/templates/modal/deletedoctor.html',
                animation: true,
                size: 'md',
                scope : $scope
            }).result.then(function(res){
                if (res){
                    Doctor.deleteDoctor(doctor.id).then(function(res){

                        if (res.status == 'success'){

                            toastr.success(res.message);

                            $scope.doctors.splice(index, 1);

                        } else {
                            toastr.error(res.message);
                        }

                    }, function(){
                        toastr.error('Ha ocurrido un error al eliminar el doctor, inténtelo nuevamente');
                    });
                }
            });
        };

    }])
    .controller('SupervisorDoctorProfileController', ['$scope', 'doctor', 'specialties', function($scope, doctor, specialties){

        $scope.doctor = doctor;
        $scope.specialties = specialties;

        //get the main specialty
        for (var i in specialties){
            if (specialties[i].id == doctor.speciality){
                $scope.main_specialty = specialties[i].speciality;
            }
        }

        for (var i in specialties){
            if (specialties[i].id == doctor.second_speciality){
                $scope.second_specialty = specialties[i].speciality;
            }
        }

    }])
    .controller('SupervisorSmallDoctorProfileController', ['$scope', 'doctor', 'specialties', 'Doctor', '$state', function($scope, doctor, specialties, Doctor, $state){

        $scope.doctor = doctor;
        $scope.specialties = specialties;

        //get the main specialty
        for (var i in specialties){
            if (specialties[i].id == doctor.speciality){
                $scope.main_specialty = specialties[i].speciality;
            }
        }

        for (var i in specialties){
            if (specialties[i].id == doctor.second_speciality){
                $scope.second_specialty = specialties[i].speciality;
            }
        }

        $scope.certifyDoctor = function(doc, status){
            Doctor.certify(doctor.id, status)
                .then(function(res){
                    if (res.status == 'success'){
                        if (status == true){
                            toastr.success('El doctor ha sido certificado satisfactoriamente');
                        } else {
                            toastr.info('La solicitud ha sido denegada satisfactoriamente');
                        }
                    } else {
                        toastr.error(res.message);
                    }
                }, function(){
                    toastr.error('Ha ocurrido un error al certificar el doctor');
                })
        };

    }])
    .controller('PendingDoctorsController', ['$scope', 'pending_doctors', 'Doctor', 'dialog', function($scope, pending_doctors, Doctor, dialog){

        $scope.pending_doctors = pending_doctors;

        $scope.removeDoctorRequest = function(doctor, index){
            dialog.confirm('Aviso', '¿Está seguro de que desea eliminar la solicitud del doctor?').then(function(res){
                if (res == true){
                    Doctor.deletePendingDoctor(doctor.id)
                        .then(function(res){
                            if (res.status == 'success'){
                                $scope.pending_doctors.splice(index, 1);
                                toastr.success('La solicitud ha sido eliminada satisfactoriamente');
                            } else {
                                toastr.error(res.message);
                            }
                        }, function(){
                            toastr.error('Ha ocurrido un error al eliminar la solicitud');
                        });
                }
            }, function(){

            });
        };

    }]);