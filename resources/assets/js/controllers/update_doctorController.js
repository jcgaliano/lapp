angular
    .module('Platease')
    .controller('update_DoctorController', ['$auth', '$scope', 'user', 'Upload', 'UserData', 'specialties', 'Doctor', '$timeout', function ($auth, $scope, user, Upload, UserData, specialties, Doctor, $timeout) {

        $scope.doctor = angular.copy(user);
        $scope.specialties = specialties;

        $scope.upload = function (file) {

            if (file){
                $scope.uploading = true;

                Upload.upload({
                    url: '/api/profile-picture',
                    data: {
                        file: file
                    }
                }).then(
                    function(res){
                        $scope.uploading = false;
                        if (res.data.status == 'success'){
                            $scope.doctor.profile_picture = res.data.file;
                            UserData.setData(angular.copy($scope.doctor));
                            $scope.$emit('profile_updated', {});
                        } else {
                            alert('Ha ocurrido un error al subir la imagen');
                        }
                    },
                    function(reason){
                        $scope.uploading = false;
                    }
                );
            }
        };

        $scope.updateDoctor = function(doctor){

            $("#update_doctor").
                validate({
                    rules: {
                        email: {
                            required: true,
                            email: true
                        },
                        name: {
                            required: true,
                        },
                        lastname: {
                            required: true,
                        },
                        specialty: {
                            required : true
                        },
                        professional_license: {
                            required: true,
                            number: true,
                        },
                        dni: {
                            required: true
                        },
                        cedula: {
                            required: true
                        },
                        cell: {
                            required: true,
                            number: true,
                            minlength: 7
                        },
                        date: {
                            required: true
                        },
                        sex : {
                          required: true
                        },
                        city: {
                            required: true
                        },
                        colony: {
                            required: true
                        },
                        street:{
                            required : true
                        },
                        number:{
                            required: true,
                            number: true
                        },
                        postal_code: {
                            required: true,
                            number: true,
                            minlength: 5,
                            maxlength: 5
                        }
                    }
                });
            if ($('#update_doctor').valid()){

                Doctor.updateDoctor($scope.doctor).then(function(res){
                    if (res.status == 'success'){
                        UserData.setData(angular.copy($scope.doctor));
                        $scope.$emit('profile_updated', {});
                        toastr.success('El perfil ha sido actualizado satisfactoriamente');
                    } else {
                        toastr.error('Ha ocurrido un error al actualizar el perfil');
                    }

                }, function(){
                    toastr.error('Ha ocurrido un error al actualizar el perfil');
                });

            }

        };
    }]);