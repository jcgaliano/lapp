angular.module('Platease')
    .controller('GlobalController', ['$scope', 'user', '$timeout','UserData', 'specialties', '$state', '$modal', function($scope, user, $timeout, UserData, specialties, $state, $modal){

        $scope.user = user;

        var updateSpecialty = function(){

            for(var i in specialties){
                if ($scope.user.speciality && specialties[i].id == $scope.user.speciality){
                    $scope.specialty_text = specialties[i].speciality;
                }

                if ($scope.user.second_speciality && specialties[i].id == $scope.user.second_speciality){
                    $scope.second_specialty_text = specialties[i].speciality;
                }
            }

        };

        if (user.user_type == 'doctor' || user.user_type == 'supervisor'){
            updateSpecialty();
        }

        $scope.navigationActiveClass = function(state){

            if ((typeof state) == 'string'){
                return state == $state.current.name ? ' active ' : '';
            }

            if ((typeof state) == 'object'){
                return state.indexOf($state.current.name) != -1  ? ' active ' : '';
            }

        };

        // main events
        $scope.$on('profile_updated', function(){
            $timeout(function(){
                $scope.$apply(function(){
                    $scope.user = UserData.getData();

                    if ($scope.user.user_type == 'doctor' || user.user_type == 'supervisor'){
                        updateSpecialty();
                    }

                });
            }, 0);
        });

        $scope.triggerPasswordChange = function(){
            $modal.open({
                animation: true,
                templateUrl: '/tesis/templates/changePasswordModal.html',
                controller: 'changePasswordController',
                backdrop: true,
                size: 'md',
                keyboard: false,
            }).result.then(function () {

            }, function () {

            });
        };

    }])
    .controller('changePasswordController', ['$scope', '$modalInstance', 'UserData',function($scope, $modalInstance, UserData){
        $scope.credentials = {
            new_password: '',
            new_password_conf: ''
        };

        $scope.changePassword = function(){

            $("#password-form").
            validate({
                rules: {
                    password: {
                        required: true,
                        minlength: 5
                    },
                    password_conf: {
                        required: true,
                        minlength: 5,
                        equalTo: '#password'
                    }
                }
            });

            if ($('#password-form').valid()){

                UserData.changePassword($scope.credentials.new_password, $scope.credentials.new_password_conf)
                    .then(function(res){
                        if (res.status == 'success'){
                            toastr.success(res.message);
                            $modalInstance.close();
                        }
                    }, function(){
                        toastr.error('Ha ocurrido un error al cambiar la contraseña');
                    });
            }

        };

    }]);