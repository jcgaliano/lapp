angular
    .module('Platease')
    .controller('SupervisorProfileController', ['$auth', '$scope', 'user', 'Upload', 'UserData', 'Supervisor', function ($auth, $scope, user, Upload, UserData, Supervisor) {

        $scope.supervisor = angular.copy(user);

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
                            $scope.supervisor.profile_picture = res.data.file;
                            UserData.setData(angular.copy($scope.supervisor));
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

        $scope.updateProfile = function(doctor){

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
                    dni: {
                        required: true
                    },
                    cell: {
                        number: true,
                        minlength: 7
                    },
                }
            });
            if ($('#update_doctor').valid()){

                Supervisor.updateProfile($scope.supervisor).then(function(res){
                    if (res.status == 'success'){
                        UserData.setData(angular.copy($scope.supervisor));
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